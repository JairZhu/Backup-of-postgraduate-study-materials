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

            // DEFINE ENDPOINT FOR INTER-ROLE COMMUNICATION HERE

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
    }
}