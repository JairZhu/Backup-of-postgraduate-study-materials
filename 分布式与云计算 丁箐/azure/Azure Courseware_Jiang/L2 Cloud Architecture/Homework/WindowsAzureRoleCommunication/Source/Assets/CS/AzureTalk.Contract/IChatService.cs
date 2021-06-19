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

namespace WindowsAzurePlatformKit.AzureTalk.Contract
{
    using System.Collections.Generic;
    using System.ServiceModel;

    /// <summary>
    /// Defines the contract for the chat service.
    /// </summary>
    [ServiceContract(
        Namespace = "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10",
        CallbackContract = typeof(IClientNotification),
        SessionMode = SessionMode.Required)]
    public interface IChatService
    {
        /// <summary>
        /// Called by client to announce they are connected at this chat endpoint.
        /// </summary>
        /// <param name="userName">The user name of the client.</param>
        /// <returns>The ClientInformation object for the new session.</returns>
        [OperationContract(IsInitiating = true)]
        ClientInformation Register(string userName);

        /// <summary>
        /// Sends a message to a user.
        /// </summary>
        /// <param name="message">The message to send.</param>
        /// <param name="sessionId">The recipient's session ID.</param>
        [OperationContract(IsInitiating = false)]
        void SendMessage(string message, string sessionId);

        /// <summary>
        /// Returns a list of connected clients.
        /// </summary>
        /// <returns>The list of active sessions.</returns>
        [OperationContract(IsInitiating = false)]
        IEnumerable<ClientInformation> GetConnectedClients();
    }
}