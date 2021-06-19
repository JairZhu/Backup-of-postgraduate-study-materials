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
        public override bool OnStart()
        {
            DiagnosticMonitor.Start("DiagnosticsConnectionString");

            return base.OnStart();
        }

        public override void Run()
        {
            Trace.TraceInformation("Worker Process entry point called.");

            while (true)
            {
                Thread.Sleep(300000);
                Trace.TraceInformation("Working...");
            }
        }
    }
}