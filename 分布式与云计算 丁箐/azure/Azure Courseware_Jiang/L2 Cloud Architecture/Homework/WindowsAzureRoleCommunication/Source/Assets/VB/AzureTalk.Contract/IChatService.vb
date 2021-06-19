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

Imports Microsoft.VisualBasic
Imports System.Collections.Generic
Imports System.ServiceModel

''' <summary>
''' Defines the contract for the chat service.
''' </summary>
<ServiceContract(Namespace := "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10", CallbackContract := GetType(IClientNotification), SessionMode := SessionMode.Required)> _
Public Interface IChatService
    ''' <summary>
    ''' Called by client to announce they are connected at this chat endpoint.
    ''' </summary>
    ''' <param name="userName">The user name of the client.</param>
    ''' <returns>The ClientInformation object for the new session.</returns>
    <OperationContract(IsInitiating := True)> _
    Function Register(ByVal userName As String) As ClientInformation

    ''' <summary>
    ''' Sends a message to a user.
    ''' </summary>
    ''' <param name="message">The message to send.</param>
    ''' <param name="sessionId">The recipient's session ID.</param>
    <OperationContract(IsInitiating := False)> _
    Sub SendMessage(ByVal message As String, ByVal sessionId As String)

    ''' <summary>
    ''' Returns a list of connected clients.
    ''' </summary>
    ''' <returns>The list of active sessions.</returns>
    <OperationContract(IsInitiating := False)> _
    Function GetConnectedClients() As IEnumerable(Of ClientInformation)
End Interface