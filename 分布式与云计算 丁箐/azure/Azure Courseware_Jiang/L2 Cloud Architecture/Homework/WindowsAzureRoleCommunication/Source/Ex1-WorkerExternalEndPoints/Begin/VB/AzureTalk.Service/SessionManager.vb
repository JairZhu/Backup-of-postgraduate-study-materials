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
Imports System.Linq
Imports System.Threading
Imports WindowsAzurePlatformKit.AzureTalk.Contract

Namespace WindowsAzurePlatformKit.AzureTalk.Service

    ''' <summary>
    ''' Manages sessions for users connected to the role. Maintains a thread-safe dictionary of active sessions.
    ''' </summary>
    Friend Class SessionManager
        ''' <summary>Controls access to the session dictionary.</summary>
        Private Shared sessionLock As New ReaderWriterLockSlim()

        ''' <summary>Contains information about all active sessions.</summary>
        Private Shared sessions As New Dictionary(Of String, SessionInformation)()

        ''' <summary>
        ''' Retrieves a session.
        ''' </summary>
        ''' <param name="sessionId">The ID of the session.</param>
        ''' <returns>The SessionInformation object representing the session.</returns>
        Public Shared Function GetSession(ByVal sessionId As String) As SessionInformation
            If sessionId Is Nothing Then
                Throw New ArgumentNullException("sessionId")
            End If

            sessionLock.EnterReadLock()
            Try
                Dim session As SessionInformation
                sessions.TryGetValue(sessionId, session)
                Return session
            Finally
                sessionLock.ExitReadLock()
            End Try
        End Function

        ''' <summary>
        ''' Updates a session.
        ''' </summary>
        ''' <param name="sessionId">The ID of the session.</param>
        ''' <param name="userName">The name of the user.</param>
        ''' <param name="roleId">The ID of the role where the session was started.</param>
        ''' <param name="callback">The callback channel to the client; null for remote sessions.</param>
        ''' <param name="session">When this method returns, contains the SessionInformation object representing the session.</param>
        ''' <returns>true if the session is new or false if the session was updated.</returns>
        Public Shared Function CreateOrUpdateSession(ByVal sessionId As String, ByVal userName As String, ByVal roleId As String, ByVal callback As IClientNotification, <System.Runtime.InteropServices.Out()> ByRef session As SessionInformation) As Boolean
            If String.IsNullOrEmpty(userName) Then
                Throw New ArgumentException("sessionId")
            End If

            If String.IsNullOrEmpty(userName) Then
                Throw New ArgumentException("userName")
            End If

            If String.IsNullOrEmpty(roleId) Then
                Throw New ArgumentException("roleId")
            End If

            sessionLock.EnterWriteLock()
            Try
                Dim isNewSession As Boolean = Not sessions.TryGetValue(sessionId, session)
                If isNewSession Then
                    session = New SessionInformation()
                    sessions.Add(sessionId, session)
                End If

                session.SessionId = sessionId
                session.UserName = userName
                session.RoleId = roleId
                session.Callback = callback
                session.IsActive = True

                Return isNewSession
            Finally
                sessionLock.ExitWriteLock()
            End Try
        End Function

        ''' <summary>
        ''' Removes a session from the active sessions list.
        ''' </summary>
        ''' <param name="sessionId">The ID of the session.</param>
        Public Shared Sub RemoveSession(ByVal sessionId As String)
            If sessionId Is Nothing Then
                Throw New ArgumentNullException("sessionId")
            End If

            sessionLock.EnterWriteLock()
            Try
                Dim session As SessionInformation
                If sessions.TryGetValue(sessionId, session) Then
                    session.IsActive = False
                    sessions.Remove(sessionId)
                End If
            Finally
                sessionLock.ExitWriteLock()
            End Try
        End Sub

        ''' <summary>
        ''' Retrieves a list of active sessions.
        ''' </summary>
        ''' <returns>A list of SessionInformation objects.</returns>
        Public Shared Function GetActiveSessions() As IEnumerable(Of SessionInformation)
            sessionLock.EnterReadLock()
            Try
                Return sessions.Values.Where(Function(session) session.IsActive).ToArray()
            Finally
                sessionLock.ExitReadLock()
            End Try
        End Function
    End Class
End Namespace