// ----------------------------------------------------------------------------------
// Microsoft Developer & Platform Evangelism
// 
// Copyright (c) Microsoft Corporation. All rights reserved.
// 
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
// ----------------------------------------------------------------------------------
// The example companies, organizations, products, domain names,
// e-mail addresses, logos, people, places, and events depicted
// herein are fictitious.  No association with any real company,
// organization, product, domain name, email address, logo, person,
// places, or events is intended or should be inferred.
// ----------------------------------------------------------------------------------

namespace WindowsAzurePlatformKit.AzureTalk.Service
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.ServiceModel;
    using Microsoft.WindowsAzure.ServiceRuntime;
    using WindowsAzurePlatformKit.AzureTalk.Contract;

    /// <summary>
    /// Implementation of the WCF chat service.
    /// </summary>
    [ServiceBehavior(
        InstanceContextMode = InstanceContextMode.Single,
        ConcurrencyMode = ConcurrencyMode.Multiple,
#if DEBUG
        IncludeExceptionDetailInFaults = true,
#else
        IncludeExceptionDetailInFaults = false,
#endif
        AddressFilterMode = AddressFilterMode.Any)]
    public class ChatService : IChatService, IClientNotification
    {
        /// <summary>
        /// Called by clients to announce they are connected at this chat endpoint.
        /// </summary>
        /// <param name="userName">The user name of the client.</param>
        /// <returns>The ClientInformation object for the new session.</returns>
        public ClientInformation Register(string userName)
        {
            // retrieve session information
            string roleId = RoleEnvironment.CurrentRoleInstance.Id;
            string sessionId = OperationContext.Current.SessionId;
            IClientNotification callback = OperationContext.Current.GetCallbackChannel<IClientNotification>();

            SessionInformation session;
            if (SessionManager.CreateOrUpdateSession(sessionId, userName, roleId, callback, out session))
            {
                // ensure that the session is killed when channel is closed
                OperationContext.Current.Channel.Closed += (sender, e) =>
                {
                    SessionManager.RemoveSession(sessionId);
                    NotifyConnectedClients(session);
                    WorkerRole.NotifyAllNodes(session);
                    Trace.TraceInformation("Session '{0}' by user '{1}' has been closed in role '{2}'.", sessionId, userName, roleId);
                };

                Trace.TraceInformation("Session '{0}' by user '{1}' has been opened in role '{2}'.", sessionId, userName, roleId);
            }

            // Notify clients connected to this role
            NotifyConnectedClients(session);

            // Notify other worker roles
            WorkerRole.NotifyAllNodes(session);

            return new ClientInformation()
            {
                SessionId = sessionId,
                UserName = userName,
                RoleId = roleId
            };
        }

        /// <summary>
        /// Sends a message to a user.
        /// </summary>
        /// <param name="message">The message to send.</param>
        /// <param name="sessionId">The recipient's session Id.</param>
        public void SendMessage(string message, string sessionId)
        {
            string fromSessionId = OperationContext.Current.SessionId;
            SessionInformation toSession = SessionManager.GetSession(sessionId);

            // if recipient is connected to this role, deliver the message to the 
            // recipient; otherwise, forward the message to the recipient's role
            if (toSession != null)
            {
                if (toSession.RoleId == RoleEnvironment.CurrentRoleInstance.Id)
                {
                  this.DeliverMessage(message, fromSessionId, sessionId);
                }
                else
                {
                  WorkerRole.ForwardMessage(message, fromSessionId, sessionId);
                }
            }
        }

        /// <summary>
        /// Returns a list of connected clients.
        /// </summary>
        /// <returns>The list of active sessions.</returns>
        public IEnumerable<ClientInformation> GetConnectedClients()
        {
            return from session in SessionManager.GetActiveSessions()
                   select new ClientInformation()
                   { 
                       SessionId = session.SessionId,
                       UserName = session.UserName,
                       RoleId = session.RoleId
                   };
        }

        /// <summary>
        /// Delivers a message to a client in the current worker role.
        /// </summary>
        /// <param name="message">The message to forward.</param>
        /// <param name="fromSessionId">The session ID of the message originator.</param>
        /// <param name="toSessionId">The session ID of the message recipient.</param>
        public void DeliverMessage(string message, string fromSessionId, string toSessionId)
        {
            SessionInformation fromSession = SessionManager.GetSession(fromSessionId);
            SessionInformation toSession = SessionManager.GetSession(toSessionId);
            if ((fromSession != null) && (toSession != null))
            {
                // retrieve the callback channel to the client
                IClientNotification callback = toSession.Callback;
                if (callback != null)
                {
                    callback.DeliverMessage(message, fromSessionId, toSessionId);
                    Trace.TraceInformation("Message '{0}' sent from '{1}' to '{2}'.", message, fromSession.UserName, toSession.UserName);
                }
            }
        }

        /// <summary>
        /// Receives notifications when a new client connects or disconnects in another worker role.
        /// </summary>
        /// <param name="clientInfo">The ClientInformation object for the client.</param>
        public void UpdateClientList(ClientInformation clientInfo)
        {
            if (clientInfo.IsActive)
            {
                SessionInformation session;
                if (SessionManager.CreateOrUpdateSession(clientInfo.SessionId, clientInfo.UserName, clientInfo.RoleId, null, out session))
                {
                    Trace.TraceInformation("Remote session '{0}' by user '{1}' has been opened in role '{2}'.", session.SessionId, session.UserName, session.RoleId);
                }
            }
            else
            {
                SessionManager.RemoveSession(clientInfo.SessionId);
                Trace.TraceInformation("Remote session '{0}' by user '{1}' has been closed in role '{2}'.", clientInfo.SessionId, clientInfo.UserName, clientInfo.RoleId);
            }

            NotifyConnectedClients(clientInfo);
        }

        /// <summary>
        /// Notifies clients connected to this worker role to update their active sessions list when a new client connects or disconnects.
        /// </summary>
        /// <param name="clientInfo">The ClientInformation object for the client.</param>
        private static void NotifyConnectedClients(ClientInformation clientInfo)
        {
            foreach (SessionInformation client in SessionManager.GetActiveSessions())
            {
                if (client.Callback != null)
                {
                    try
                    {
                        client.Callback.UpdateClientList(clientInfo);
                    }
                    catch (TimeoutException timeoutException)
                    {
                        Trace.TraceError("Unable to notify client '{0}'. The service operation timed out. {1}", client.UserName, timeoutException.Message);
                        ((ICommunicationObject)client).Abort();
                        client.Callback = null;
                    }
                    catch (CommunicationException communicationException)
                    {
                        Trace.TraceError("Unable to notify client '{0}'. There was a communication problem. {1} - {2}", client.UserName, communicationException.Message, communicationException.StackTrace);
                        ((ICommunicationObject)client).Abort();
                        client.Callback = null;
                    }
                }
            }
        }
    }
}