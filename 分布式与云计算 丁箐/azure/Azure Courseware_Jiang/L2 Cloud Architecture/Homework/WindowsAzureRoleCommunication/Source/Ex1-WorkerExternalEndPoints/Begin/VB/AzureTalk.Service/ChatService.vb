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
            Throw New NotImplementedException()
        End Function

        ''' <summary>
        ''' Sends a message to a user.
        ''' </summary>
        ''' <param name="message">The message to send.</param>
        ''' <param name="sessionId">The recipient's session Id.</param>
        Public Sub SendMessage(ByVal message As String, ByVal sessionId As String) Implements IChatService.SendMessage
            Throw New NotImplementedException()
        End Sub

        ''' <summary>
        ''' Returns a list of connected clients.
        ''' </summary>
        ''' <returns>The list of active sessions.</returns>
        Public Function GetConnectedClients() As IEnumerable(Of ClientInformation) Implements IChatService.GetConnectedClients
            Throw New NotImplementedException()
        End Function
    End Class
End Namespace