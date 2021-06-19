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
Imports System.ServiceModel

''' <summary>
''' Defines the contract for the callback channel to the client. Also used to forward messages across roles.
''' </summary>
<ServiceContract(Namespace := "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10")> _
Public Interface IClientNotification
    ''' <summary>
    ''' Delivers a message to a client in the current worker role.
    ''' </summary>
    ''' <param name="message">The message to forward.</param>
    ''' <param name="fromSessionId">The session ID of the message originator.</param>
    ''' <param name="toSessionId">The session ID of the message recipient.</param>
    <OperationContract(IsOneWay := True)> _
    Sub DeliverMessage(ByVal message As String, ByVal fromSessionId As String, ByVal toSessionId As String)

    ''' <summary>
    ''' Notifies peers to update their active sessions list when a client connects or disconnects.
    ''' </summary>
    ''' <param name="clientInfo">The ClientInformation object for the client.</param>
    <OperationContract(IsOneWay := True)> _
    Sub UpdateClientList(ByVal clientInfo As ClientInformation)
End Interface