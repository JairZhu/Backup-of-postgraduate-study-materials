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
    using System.Runtime.Serialization;

    /// <summary>
    /// Contains information about a client session.
    /// </summary>   
    [DataContract(Namespace = "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10:schemas")]
    public class ClientInformation
    {
        /// <summary>Gets or sets the ID of the client session.</summary>
        [DataMember]
        public string SessionId { get; set; }

        /// <summary>Gets or sets the name of the client.</summary>
        [DataMember]
        public string UserName { get; set; }

        /// <summary>Gets or sets the ID of the role where the session is active.</summary>
        [DataMember]
        public string RoleId { get; set; }

        /// <summary>true indicates that the session is active, false otherwise.</summary>
        [DataMember]
        public bool IsActive { get; set; }
    }
}