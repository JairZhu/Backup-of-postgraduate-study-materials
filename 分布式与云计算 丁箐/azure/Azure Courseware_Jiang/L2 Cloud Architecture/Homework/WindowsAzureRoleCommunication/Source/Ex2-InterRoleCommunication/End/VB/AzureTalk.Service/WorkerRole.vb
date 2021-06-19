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
        ' <summary>Channel factory for inter-role notifications.</summary>
        Private Shared factory As ChannelFactory(Of IClientNotification)

        ' <summary>ServiceHost object for internal and external endpoints.</summary>
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

            ' define an internal endpoint for inter-role traffic
            Dim internalEndPoint As RoleInstanceEndpoint = RoleEnvironment.CurrentRoleInstance.InstanceEndpoints("NotificationService")
            Me.serviceHost.AddServiceEndpoint(GetType(IClientNotification), binding, String.Format("net.tcp://{0}/NotificationService", internalEndPoint.IPEndpoint))

            ' create channel factory for inter-role communication
            WorkerRole.factory = New ChannelFactory(Of IClientNotification)(binding)

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

        ''' <summary>
        ''' Notifies all available worker roles to update their active sessions list 
        ''' when a new client connects or disconnects.
        ''' </summary>
        ''' <param name="session">The SessionInformation object for the client.</param>
        Friend Shared Sub NotifyAllNodes(ByVal session As SessionInformation)
            ' iterate over all instances of the internal endpoint except the current role - no need to notify itself
            Dim current = RoleEnvironment.CurrentRoleInstance
            Dim endPoints = current.Role.Instances.Where(Function(instance) instance IsNot current).Select(Function(instance) instance.InstanceEndpoints("NotificationService"))

            For Each ep In endPoints
                Dim address As New EndpointAddress(String.Format("net.tcp://{0}/NotificationService", ep.IPEndpoint))
                Dim client As IClientNotification = WorkerRole.factory.CreateChannel(address)

                Try
                    client.UpdateClientList(session)
                    CType(client, ICommunicationObject).Close()
                Catch timeoutException As TimeoutException
                    Trace.TraceError("Unable to notify worker role instance '{0}'. The service operation timed out. {1}", ep.RoleInstance.Id, timeoutException.Message)
                    CType(client, ICommunicationObject).Abort()
                Catch communicationException As CommunicationException
                    Trace.TraceError("Unable to notify worker role instance '{0}'. There was a communication problem. {1} - {2}", ep.RoleInstance.Id, communicationException.Message, communicationException.StackTrace)
                    CType(client, ICommunicationObject).Abort()
                End Try
            Next ep
        End Sub

        ' <summary>
        ' Forwards a message from the current role to the role of the destination session.
        ' </summary>
        ' <param name="message">The message to forward.</param>
        ' <param name="fromSessionId">The ID of the source session.</param>
        ' <param name="toSessionId">The ID of the target session.</param>
        Public Shared Sub ForwardMessage(ByVal message As String, ByVal fromSessionId As String, ByVal toSessionId As String)
            Dim session As SessionInformation = SessionManager.GetSession(toSessionId)
            If session Is Nothing Then
                Return
            End If

            ' retrieve the endpoint for the role instance where the target session is active
            Dim targetRole = RoleEnvironment.CurrentRoleInstance.Role.Instances.Where(Function(role) role.Id = session.RoleId).FirstOrDefault()
            If targetRole IsNot Nothing Then
                Dim ep = targetRole.InstanceEndpoints("NotificationService")
                If ep IsNot Nothing Then
                    Dim address As New EndpointAddress(String.Format("net.tcp://{0}/NotificationService", ep.IPEndpoint))

                    Dim client As IClientNotification = WorkerRole.factory.CreateChannel(address)
                    Try
                        client.DeliverMessage(message, fromSessionId, toSessionId)
                        CType(client, ICommunicationObject).Close()
                    Catch timeoutException As TimeoutException
                        Trace.TraceError("Unable to forward message to instance '{0}'. The service operation timed out. {1}", ep.RoleInstance.Id, timeoutException.Message)
                        CType(client, ICommunicationObject).Abort()
                    Catch communicationException As CommunicationException
                        Trace.TraceError("Unable to forward message to instance '{0}'. There was a communication problem. {1} - {2}", ep.RoleInstance.Id, communicationException.Message, communicationException.StackTrace)
                        CType(client, ICommunicationObject).Abort()
                    End Try
                End If
            End If
        End Sub

    End Class
End Namespace