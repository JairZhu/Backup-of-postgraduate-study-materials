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
    public class ChatService : IChatService
    {
        /// <summary>
        /// Called by clients to announce they are connected at this chat endpoint.
        /// </summary>
        /// <param name="userName">The user name of the client.</param>
        /// <returns>The ClientInformation object for the new session.</returns>
        public ClientInformation Register(string userName)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Sends a message to a user.
        /// </summary>
        /// <param name="message">The message to send.</param>
        /// <param name="sessionId">The recipient's session Id.</param>
        public void SendMessage(string message, string sessionId)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Returns a list of connected clients.
        /// </summary>
        /// <returns>The list of active sessions.</returns>
        public IEnumerable<ClientInformation> GetConnectedClients()
        {
            throw new NotImplementedException();
        }
    }
}