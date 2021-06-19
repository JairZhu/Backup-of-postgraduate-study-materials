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

        ''' <summary>ServiceHost object for internal and external endpoints.</summary>
        Private serviceHost As ServiceHost

        Public Overrides Function OnStart() As Boolean
            DiagnosticMonitor.Start("DiagnosticsConnectionString")

            Return MyBase.OnStart()
        End Function

        Public Overrides Sub Run()
            Trace.TraceInformation("Worker Process entry point called.")

            Me.StartChatService(3)

            Do
                Thread.Sleep(300000)
                Trace.TraceInformation("Working...")
            Loop
        End Sub

        ''' <summary>
        ''' Starts the service host object for the internal 
        ''' and external endpoints of the chat service.
        ''' </summary>
        ''' <param name="retries">Specifies the number of retries to 
        ''' start the service in case of failure.</param>
        Private Sub StartChatService(ByVal retries As Integer)
            ' recycle the role if host cannot be started 
            ' after the specified number of retries
            If retries = 0 Then
                RoleEnvironment.RequestRecycle()
                Return
            End If

            Trace.TraceInformation("Starting chat service host...")

            Me.serviceHost = New ServiceHost(GetType(ChatService))

            ' Recover the service in case of failure. 
            ' Log the fault and attempt to restart the service host. 
            AddHandler Me.serviceHost.Faulted, Function(sender, e) OnFaulted(sender, e, retries)

            ' use NetTcpBinding with no security
            Dim binding As New NetTcpBinding(SecurityMode.None)

            ' define an external endpoint for client traffic
            Dim externalEndPoint As RoleInstanceEndpoint = RoleEnvironment.CurrentRoleInstance.InstanceEndpoints("ChatService")

            Me.serviceHost.AddServiceEndpoint(GetType(IChatService), binding, String.Format("net.tcp://{0}/ChatService", externalEndPoint.IPEndpoint))

            Try
                Me.serviceHost.Open()
                Trace.TraceInformation("Chat service host started successfully.")
            Catch timeoutException As TimeoutException
                Trace.TraceError("The service operation timed out. {0}", timeoutException.Message)
            Catch communicationException As CommunicationException
                Trace.TraceError("Could not start chat service host. {0}", communicationException.Message)
            End Try
        End Sub

        Private Function OnFaulted(ByVal sender As Object, ByVal e As Object, ByVal retries As Integer) As Object
            Trace.TraceError("Host fault occured. Aborting and restarting the host. Retry count: {0}", retries)
            Me.serviceHost.Abort()
            retries -= 1
            Me.StartChatService(retries)
            Return Nothing
        End Function

    End Class
End Namespace