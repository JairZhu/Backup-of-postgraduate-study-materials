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
Imports System.Runtime.Serialization

''' <summary>
''' Contains information about a client session.
''' </summary>   
<DataContract(Namespace := "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10:schemas")> _
Public Class ClientInformation
    ''' <summary>Gets or sets the ID of the client session.</summary>
    Private privateSessionId As String
    <DataMember> _
    Public Property SessionId() As String
        Get
            Return privateSessionId
        End Get
        Set(ByVal value As String)
            privateSessionId = value
        End Set
    End Property

    ''' <summary>Gets or sets the name of the client.</summary>
    Private privateUserName As String
    <DataMember> _
    Public Property UserName() As String
        Get
            Return privateUserName
        End Get
        Set(ByVal value As String)
            privateUserName = value
        End Set
    End Property

    ''' <summary>Gets or sets the ID of the role where the session is active.</summary>
    Private privateRoleId As String
    <DataMember> _
    Public Property RoleId() As String
        Get
            Return privateRoleId
        End Get
        Set(ByVal value As String)
            privateRoleId = value
        End Set
    End Property

    ''' <summary>true indicates that the session is active, false otherwise.</summary>
    Private privateIsActive As Boolean
    <DataMember> _
    Public Property IsActive() As Boolean
        Get
            Return privateIsActive
        End Get
        Set(ByVal value As Boolean)
            privateIsActive = value
        End Set
    End Property
End Class