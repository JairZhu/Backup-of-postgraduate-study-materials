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
Imports System.ServiceModel
Imports WindowsAzurePlatformKit.AzureTalk.Contract

Friend Class ChatClient
    Implements IChatService
    Public Interface IChatServiceChannel
    Inherits IChatService, IClientChannel
    End Interface

    Private factory As ChannelFactory(Of IChatServiceChannel)
    Private _Renamedchannel As IChatServiceChannel

    Public Event [Error] As EventHandler(Of ClientErrorEventArgs)

    Public Sub New(ByVal callbackObject As IClientNotification, ByVal endpoint As String)
        Dim binding As New NetTcpBinding(SecurityMode.None, False)
        Me.factory = New DuplexChannelFactory(Of IChatServiceChannel)(callbackObject, binding, endpoint)
    End Sub

    Public Function Register(ByVal userName As String) As ClientInformation Implements IChatService.Register
        Try
            Return Me.Channel.Register(userName)
        Catch timeoutException As TimeoutException
            OnError("Failed to sign in. The service operation timed out. {0}", timeoutException.Message)
        Catch communicationException As CommunicationException
            OnError("Failed to sign in. There was a communication problem. {0}", communicationException.Message)
        End Try

        Return Nothing
    End Function

    Public Sub SendMessage(ByVal message As String, ByVal toUserName As String) Implements IChatService.SendMessage
        Try
            Me.Channel.SendMessage(message, toUserName)
        Catch timeoutException As TimeoutException
            OnError("Failed to send the message. The service operation timed out. {0}", timeoutException.Message)
        Catch communicationException As CommunicationException
            OnError("Failed to send the message. There was a communication problem. {0}", communicationException.Message)
        End Try
    End Sub

    Public Function GetConnectedClients() As IEnumerable(Of ClientInformation) Implements IChatService.GetConnectedClients
        Try
            Return Me.Channel.GetConnectedClients()
        Catch timeoutException As TimeoutException
            OnError("Failed to retrieve the list of connected clients. The service operation timed out. {0}", timeoutException.Message)
        Catch communicationException As CommunicationException
            OnError("Failed to retrieve the list of connected clients. There was a communication problem. {0}", communicationException.Message)
        End Try

        Return New ClientInformation(){}
    End Function

    Public Sub Close()
        Try
            If Me._Renamedchannel IsNot Nothing Then
                Me._Renamedchannel.Close()
            End If
        Catch e1 As TimeoutException
            Me._Renamedchannel.Abort()
        Catch e2 As CommunicationException
            Me._Renamedchannel.Abort()
        End Try

        Me._Renamedchannel = Nothing
    End Sub

    Public ReadOnly Property Channel() As IChatServiceChannel
        Get
            If Me._Renamedchannel Is Nothing OrElse Me._Renamedchannel.State = CommunicationState.Faulted Then
                Me._Renamedchannel = Me.factory.CreateChannel()
                AddHandler _Renamedchannel.Faulted, Function(sender, e) AnonymousMethod1(sender, e)
            End If
            Return Me._Renamedchannel
        End Get
    End Property

Private Function AnonymousMethod1(ByVal sender As Object, ByVal e As EventArgs) As Object
        Me._Renamedchannel.Abort()
        Me._Renamedchannel = Nothing
    Return Nothing
End Function

    Private Sub OnError(ByVal message As String, ParamArray ByVal args() As Object)
        RaiseEvent Error(Me, New ClientErrorEventArgs() With {.Message = String.Format(message, args), .Cancel = False})
    End Sub

    Public Class ClientErrorEventArgs
        Inherits EventArgs
        Private privateMessage As String
        Public Property Message() As String
            Get
                Return privateMessage
            End Get
            Set(ByVal value As String)
                privateMessage = value
            End Set
        End Property
        Private privateCancel As Boolean
        Public Property Cancel() As Boolean
            Get
                Return privateCancel
            End Get
            Set(ByVal value As Boolean)
                privateCancel = value
            End Set
        End Property
    End Class
End Class