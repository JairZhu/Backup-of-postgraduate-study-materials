' ----------------------------------------------------------------------------------
' Microsoft Developer & Platform Evangelism
' 
' Copyright (c) Microsoft Corporation. All rights reserved.
' 
' THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
' EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
' OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
' ----------------------------------------------------------------------------------
' The example companies, organizations, products, domain names,
' e-mail addresses, logos, people, places, and events depicted
' herein are fictitious.  No association with any real company,
' organization, product, domain name, email address, logo, person,
' places, or events is intended or should be inferred.
' ----------------------------------------------------------------------------------

Imports System
Imports Microsoft.VisualBasic
Imports System.Diagnostics
Imports System.Linq
Imports System.ServiceModel
Imports System.Threading
Imports Microsoft.WindowsAzure.Diagnostics
Imports Microsoft.WindowsAzure.ServiceRuntime
Imports WindowsAzurePlatformKit.AzureTalk.Contract

Namespace WindowsAzurePlatformKit.AzureTalk.Service

    Public Class WorkerRole
        Inherits RoleEntryPoint
        Public Overrides Function OnStart() As Boolean
            DiagnosticMonitor.Start("DiagnosticsConnectionString")

            Return MyBase.OnStart()
        End Function

        Public Overrides Sub Run()
            Trace.TraceInformation("Worker Process entry point called.")

            Do
                Thread.Sleep(300000)
                Trace.TraceInformation("Working...")
            Loop
        End Sub
    End Class
End Namespace