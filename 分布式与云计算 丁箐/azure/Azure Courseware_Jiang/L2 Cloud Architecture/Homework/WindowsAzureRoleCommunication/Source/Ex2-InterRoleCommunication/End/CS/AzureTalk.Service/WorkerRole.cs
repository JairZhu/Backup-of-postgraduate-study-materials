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
    using System.Diagnostics;
    using System.Linq;
    using System.ServiceModel;
    using System.Threading;
    using Microsoft.WindowsAzure.Diagnostics;
    using Microsoft.WindowsAzure.ServiceRuntime;
    using WindowsAzurePlatformKit.AzureTalk.Contract;

    public class WorkerRole : RoleEntryPoint
    {
        /// <summary>Cached channel factory for inter-role notifications.</summary>
        private static ChannelFactory<IClientNotification> factory;

        /// <summary>ServiceHost object for internal and external endpoints.</summary>
        private ServiceHost serviceHost;

        public override bool OnStart()
        {
            DiagnosticMonitor.Start("DiagnosticsConnectionString");

            return base.OnStart();
        }

        public override void Run()
        {
            Trace.TraceInformation("Worker Process entry point called.");
            
            this.StartChatService(3);

            while (true)
            {
                Thread.Sleep(300000);
                Trace.TraceInformation("Working...");
            }
        }

        /// <summary>
        /// Starts the service host object for the internal 
        /// and external endpoints of the chat service.
        /// </summary>
        /// <param name="retries">Specifies the number of retries to 
        /// start the service in case of failure.</param>
        private void StartChatService(int retries)
        {
            // recycle the role if host cannot be started 
            // after the specified number of retries
            if (retries == 0)
            {
                RoleEnvironment.RequestRecycle();
                return;
            }

            Trace.TraceInformation("Starting chat service host...");

            this.serviceHost = new ServiceHost(typeof(ChatService));

            // Recover the service in case of failure. 
            // Log the fault and attempt to restart the service host. 
            this.serviceHost.Faulted += (sender, e) =>
            {
                Trace.TraceError("Host fault occured. Aborting and restarting the host. Retry count: {0}", retries);
                this.serviceHost.Abort();
                this.StartChatService(--retries);
            };

            // use NetTcpBinding with no security
            NetTcpBinding binding = new NetTcpBinding(SecurityMode.None);

            // define an external endpoint for client traffic
            RoleInstanceEndpoint externalEndPoint =
                RoleEnvironment.CurrentRoleInstance.InstanceEndpoints["ChatService"];
            
            this.serviceHost.AddServiceEndpoint(
                            typeof(IChatService),
                            binding,
                            String.Format("net.tcp://{0}/ChatService", externalEndPoint.IPEndpoint));

            // define an internal endpoint for inter-role traffic
            RoleInstanceEndpoint internalEndPoint =
                RoleEnvironment.CurrentRoleInstance.InstanceEndpoints["NotificationService"];
            this.serviceHost.AddServiceEndpoint(
                            typeof(IClientNotification),
                            binding,
                            String.Format("net.tcp://{0}/NotificationService", internalEndPoint.IPEndpoint));

            // create channel factory for inter-role communication
            WorkerRole.factory = new ChannelFactory<IClientNotification>(binding);

            try
            {
                this.serviceHost.Open();
                Trace.TraceInformation("Chat service host started successfully.");
            }
            catch (TimeoutException timeoutException)
            {
                Trace.TraceError("The service operation timed out. {0}", timeoutException.Message);
            }
            catch (CommunicationException communicationException)
            {
                Trace.TraceError("Could not start chat service host. {0}", communicationException.Message);
            }
        }

        /// <summary>
        /// Notifies all available worker roles to update their active sessions list 
        /// when a new client connects or disconnects.
        /// </summary>
        /// <param name="session">The SessionInformation object for the client.</param>
        internal static void NotifyAllNodes(SessionInformation session)
        {
            // iterate over all instances of the internal endpoint except the current role - no need to notify itself
            var current = RoleEnvironment.CurrentRoleInstance;
            var endPoints = current.Role.Instances.Where(instance => instance != current)
                            .Select(instance => instance.InstanceEndpoints["NotificationService"]);

            foreach (var ep in endPoints)
            {
                EndpointAddress address =
                    new EndpointAddress(String.Format("net.tcp://{0}/NotificationService", ep.IPEndpoint));
                IClientNotification client = WorkerRole.factory.CreateChannel(address);

                try
                {
                    client.UpdateClientList(session);
                    ((ICommunicationObject)client).Close();
                }
                catch (TimeoutException timeoutException)
                {
                    Trace.TraceError("Unable to notify worker role instance '{0}'. The service operation timed out. {1}", ep.RoleInstance.Id, timeoutException.Message);
                    ((ICommunicationObject)client).Abort();
                }
                catch (CommunicationException communicationException)
                {
                    Trace.TraceError("Unable to notify worker role instance '{0}'. There was a communication problem. {1} - {2}", ep.RoleInstance.Id, communicationException.Message, communicationException.StackTrace);
                    ((ICommunicationObject)client).Abort();
                }
            }
        }

        /// <summary>
        /// Forwards a message from the current role to the role of the destination session.
        /// </summary>
        /// <param name="message">The message to forward.</param>
        /// <param name="fromSessionId">The ID of the source session.</param>
        /// <param name="toSessionId">The ID of the target session.</param>
        public static void ForwardMessage(string message, string fromSessionId, string toSessionId)
        {
            SessionInformation session = SessionManager.GetSession(toSessionId);
            if (session == null)
            {
                return;
            }

            // retrieve the endpoint for the role instance where the target session is active
            var targetRole = RoleEnvironment.CurrentRoleInstance.Role.Instances.Where(role => role.Id == session.RoleId).FirstOrDefault();
            if (targetRole != null)
            {
                var ep = targetRole.InstanceEndpoints["NotificationService"];
                if (ep != null)
                {
                    EndpointAddress address =
                        new EndpointAddress(String.Format("net.tcp://{0}/NotificationService", ep.IPEndpoint));

                    IClientNotification client = WorkerRole.factory.CreateChannel(address);
                    try
                    {
                        client.DeliverMessage(message, fromSessionId, toSessionId);
                        ((ICommunicationObject)client).Close();
                    }
                    catch (TimeoutException timeoutException)
                    {
                        Trace.TraceError("Unable to forward message to instance '{0}'. The service operation timed out. {1}", ep.RoleInstance.Id, timeoutException.Message);
                        ((ICommunicationObject)client).Abort();
                    }
                    catch (CommunicationException communicationException)
                    {
                        Trace.TraceError("Unable to forward message to instance '{0}'. There was a communication problem. {1} - {2}", ep.RoleInstance.Id, communicationException.Message, communicationException.StackTrace);
                        ((ICommunicationObject)client).Abort();
                    }
                }
            }
        }
    }
}