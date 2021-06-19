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
Imports System.Collections.Generic
Imports System.Diagnostics
Imports System.Linq
Imports System.ServiceModel
Imports Microsoft.WindowsAzure.ServiceRuntime
Imports WindowsAzurePlatformKit.AzureTalk.Contract

Namespace WindowsAzurePlatformKit.AzureTalk.Service

    ''' <summary>
    ''' Implementation of the WCF chat service.
    ''' </summary>
    <ServiceBehavior(InstanceContextMode:=InstanceContextMode.Single, ConcurrencyMode:=ConcurrencyMode.Multiple, IncludeExceptionDetailInFaults:=True, AddressFilterMode:=AddressFilterMode.Any)> _
    Public Class ChatService
        Implements IChatService

        ''' <summary>
        ''' Called by clients to announce they are connected at this chat endpoint.
        ''' </summary>
        ''' <param name="userName">The user name of the client.</param>
        ''' <returns>The ClientInformation object for the new session.</returns>        
        Public Function Register(ByVal userName As String) As ClientInformation Implements IChatService.Register
            ' retrieve session information
            Dim roleId As String = RoleEnvironment.CurrentRoleInstance.Id
            Dim sessionId As String = OperationContext.Current.SessionId
            Dim callback As IClientNotification = OperationContext.Current.GetCallbackChannel(Of IClientNotification)()

            Dim session As SessionInformation
            If SessionManager.CreateOrUpdateSession(sessionId, userName, roleId, callback, session) Then
                ' ensure that the session is killed when channel is closed
                AddHandler OperationContext.Current.Channel.Closed, Function(sender, e) OnClosed(sender, e, sessionId, session, userName, roleId)

                Trace.TraceInformation("Session '{0}' by user '{1}' has been opened in role '{2}'.", sessionId, userName, roleId)
            End If

            ' Notify clients connected to this role
            NotifyConnectedClients(session)

            Return New ClientInformation() With {.SessionId = sessionId, .UserName = userName, .RoleId = roleId}
        End Function

        Private Function OnClosed(ByVal sender As Object, ByVal e As Object, ByVal sessionId As String, ByVal session As SessionInformation, ByVal userName As String, ByVal roleId As String) As Object
            SessionManager.RemoveSession(sessionId)
            NotifyConnectedClients(session)
            Trace.TraceInformation("Session '{0}' by user '{1}' has been closed in role '{2}'.", sessionId, userName, roleId)
            Return Nothing
        End Function

        ''' <summary>
        ''' Sends a message to a user.
        ''' </summary>
        ''' <param name="message">The message to send.</param>
        ''' <param name="sessionId">The recipient's session Id.</param>
        Public Sub SendMessage(ByVal message As String, ByVal sessionId As String) Implements IChatService.SendMessage
            Dim fromSessionId As String = OperationContext.Current.SessionId
            Me.DeliverMessage(message, fromSessionId, sessionId)
        End Sub

        ''' <summary>
        ''' Returns a list of connected clients.
        ''' </summary>
        ''' <returns>The list of active sessions.</returns>
        Public Function GetConnectedClients() As IEnumerable(Of ClientInformation) Implements IChatService.GetConnectedClients
            Return _
            From session In SessionManager.GetActiveSessions() _
            Select New ClientInformation() With {.SessionId = session.SessionId, .UserName = session.UserName, .RoleId = session.RoleId}
        End Function

        ''' <summary>
        ''' Delivers a message to a client in the current worker role.
        ''' </summary>
        ''' <param name="message">The message to forward.</param>
        ''' <param name="fromSessionId">The session ID of the message originator.</param>
        ''' <param name="toSessionId">The session ID of the message recipient.</param>
        Public Sub DeliverMessage(ByVal message As String, ByVal fromSessionId As String, ByVal toSessionId As String)
            Dim fromSession As SessionInformation = SessionManager.GetSession(fromSessionId)
            Dim toSession As SessionInformation = SessionManager.GetSession(toSessionId)
            If (fromSession IsNot Nothing) AndAlso (toSession IsNot Nothing) Then
                ' retrieve the callback channel to the client
                Dim callback As IClientNotification = toSession.Callback
                If callback IsNot Nothing Then
                    callback.DeliverMessage(message, fromSessionId, toSessionId)
                    Trace.TraceInformation("Message '{0}' sent from '{1}' to '{2}'.", message, fromSession.UserName, toSession.UserName)
                End If
            End If
        End Sub


        ''' <summary>
        ''' Notifies clients connected to this worker role to update their active sessions list when a new client connects or disconnects.
        ''' </summary>
        ''' <param name="clientInfo">The ClientInformation object for the client.</param>
        Private Shared Sub NotifyConnectedClients(ByVal clientInfo As ClientInformation)
            For Each client As SessionInformation In SessionManager.GetActiveSessions()
                If client.Callback IsNot Nothing Then
                    Try
                        client.Callback.UpdateClientList(clientInfo)
                    Catch timeoutException As TimeoutException
                        Trace.TraceError("Unable to notify client '{0}'. The service operation timed out. {1}", client.UserName, timeoutException.Message)
                        CType(client, ICommunicationObject).Abort()
                        client.Callback = Nothing
                    Catch communicationException As CommunicationException
                        Trace.TraceError("Unable to notify client '{0}'. There was a communication problem. {1} - {2}", client.UserName, communicationException.Message, communicationException.StackTrace)
                        CType(client, ICommunicationObject).Abort()
                        client.Callback = Nothing
                    End Try
                End If
            Next client
        End Sub
    End Class
End Namespace