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
Imports System.Collections.ObjectModel
Imports System.Linq
Imports System.Reflection
Imports System.ServiceModel
Imports System.Threading
Imports System.Windows
Imports System.Windows.Controls
Imports WindowsAzurePlatformKit.AzureTalk.Contract

''' <summary>
''' WPF Chat Client for Inter-Role Communication HOL
''' </summary>
<CallbackBehavior(UseSynchronizationContext := False)> _
Partial Public Class MainWindow
    Inherits Window
    Implements IClientNotification
    Private client As ChatClient
    Private currentSession As ClientInformation
    Private context As SynchronizationContext
    Private keepAliveTimer As Timer
    Private userList As ObservableCollection(Of ClientInformation)

    Public Sub New()
        InitializeComponent()
        Me.context = SynchronizationContext.Current
    End Sub

    Protected Overrides Sub OnClosed(ByVal e As EventArgs)
        MyBase.OnClosed(e)

        If Me.keepAliveTimer IsNot Nothing Then
            Me.keepAliveTimer.Dispose()
        End If

        If Me.client IsNot Nothing Then
            Me.client.Close()
        End If
    End Sub

    Private Sub OnConnect(ByVal sender As Object, ByVal e As RoutedEventArgs)
        Try
            If currentSession Is Nothing Then
                Dim userName As String = Me.userNameTextBox.Text
                Me.client = New ChatClient(Me, Me.endPointTextBox.Text)

                AddHandler Me.client.Error, AddressOf Me.ShowingError

                Me.currentSession = Me.client.Register(userName)
                If Me.currentSession IsNot Nothing Then
                    Me.keepAliveTimer = New System.Threading.Timer(Function(state) RegisteringUserName(state, userName), Nothing, 55000, 55000)

                    Me.Title = String.Format("{0} - {1} in worker role {2}", System.Reflection.Assembly.GetEntryAssembly().GetName().Name, Me.userNameTextBox.Text, Me.currentSession.RoleId)
                    Me.connectButton.Content = "Sign out"
                    Me.userNameTextBox.IsEnabled = False
                    Me.endPointTextBox.IsEnabled = False
                    RefreshUsers()
                End If
            Else
                Me.keepAliveTimer.Dispose()
                Me.client.Close()
                Me.currentSession = Nothing
                Me.messages.Document.Blocks.Clear()
                Me.userList.Clear()
                Me.Title = System.Reflection.Assembly.GetEntryAssembly().GetName().Name
                Me.connectButton.Content = "Sign in"
                Me.userNameTextBox.IsEnabled = True
                Me.endPointTextBox.IsEnabled = True
            End If
        Catch ex As Exception
            ShowError(ex.Message)
        End Try
    End Sub

    Private Function ShowingError(ByVal s As Object, ByVal ea As WindowsAzurePlatformKit.AzureTalk.Client.ChatClient.ClientErrorEventArgs) As Object
        ShowError(ea.Message)
        Return Nothing
    End Function

    Private Function RegisteringUserName(ByVal state As Object, ByVal userName As String) As Object
        Me.client.Register(userName)
        Return Nothing
    End Function

    Private Sub UpdateConversation(ByVal message As String, ByVal fromUserName As String)
        Me.context.Post(Function(state) Me.AddMessage(message, fromUserName), Nothing)
    End Sub

    Private Sub RefreshUsers()
        Dim onlineUsers = Me.client.GetConnectedClients().Where(Function(p) p.UserName <> Me.userNameTextBox.Text)
        Me.userList = New ObservableCollection(Of ClientInformation)(onlineUsers)
        Me.DataContext = Me.userList
    End Sub

    Private Function AddMessage(ByVal message As String, ByVal fromUserName As String)
        Me.messages.AppendText(String.Format("{0} says: {1}", fromUserName, message))
        Me.messages.AppendText(Constants.vbCrLf)
        Me.messages.ScrollToEnd()
        Return Nothing
    End Function

    Private Sub OnSend(ByVal sender As Object, ByVal e As RoutedEventArgs)
        Dim toUser As ClientInformation = CType(usersListView.SelectedItem, ClientInformation)
        If toUser Is Nothing Then
            MessageBox.Show("Please choose a user to send the message.")
            Return
        End If

        Dim message As String = Me.messageTextBox.Text
        AddMessage(message, Me.currentSession.UserName)
        Me.client.SendMessage(message, toUser.SessionId)
        Me.messageTextBox.Text = String.Empty
    End Sub

    #Region "IClientNotification Members"

    Public Sub DeliverMessage(ByVal message As String, ByVal fromSessionId As String, ByVal toSessionId As String) Implements IClientNotification.DeliverMessage
        Me.context.Post(Function(state) AnonymousMethod3(state, fromSessionId, message), Nothing)
    End Sub

Private Function AnonymousMethod3(ByVal state As Object, ByVal fromSessionId As String, ByVal message As String) As Object
        Dim fromSession = Me.userList.FirstOrDefault(Function(userInfo) userInfo.SessionId = fromSessionId)
        If fromSession IsNot Nothing Then
            Me.AddMessage(message, fromSession.UserName)
        Else
            ShowError("A message was received from an unknown sender. The session ID '{0}' is not registered.", fromSessionId)
        End If
    Return Nothing
End Function

    Public Sub UpdateClientList(ByVal session As ClientInformation) Implements IClientNotification.UpdateClientList
        Me.context.Post(Function(state) UpdatingClientList(state, session), Nothing)
    End Sub

    Private Function UpdatingClientList(ByVal state As Object, ByVal session As ClientInformation) As Object
        If session.UserName = Me.userNameTextBox.Text Then
            Return Nothing
        End If
        Dim client = Me.userList.FirstOrDefault(Function(userInfo) userInfo.SessionId = session.SessionId)
        If session.IsActive Then
            If client Is Nothing Then
                Me.userList.Add(session)
                Me.messages.AppendText(String.Format("User '{0}' has joined the chat.", session.UserName))
                Me.messages.AppendText(Constants.vbCrLf)
            Else
                client.UserName = session.UserName
                client.RoleId = session.RoleId
            End If
        Else
            If client IsNot Nothing Then
                Me.userList.Remove(client)
                Me.messages.AppendText(String.Format("User '{0}' has left the chat.", client.UserName))
                Me.messages.AppendText(Constants.vbCrLf)
            End If
        End If
        Return Nothing
    End Function

    #End Region

    Private Sub ShowError(ByVal message As String, ParamArray ByVal args() As Object)
        MessageBox.Show(String.Format(message, args), "Error", MessageBoxButton.OK, MessageBoxImage.Error)
    End Sub

    Private Sub OnConnectionParametersChanged(ByVal sender As Object, ByVal e As TextChangedEventArgs)
        If Me.IsInitialized Then
            Me.connectButton.IsEnabled = Not (String.IsNullOrEmpty(Me.endPointTextBox.Text) OrElse String.IsNullOrEmpty(Me.userNameTextBox.Text))
        End If
    End Sub

    Private Sub OnMessageTextChanged(ByVal sender As Object, ByVal e As TextChangedEventArgs)
        Me.sendButton.IsEnabled = (Not String.IsNullOrEmpty(Me.messageTextBox.Text)) AndAlso (Me.currentSession IsNot Nothing)
    End Sub
End Class