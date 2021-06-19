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

Namespace WindowsAzurePlatformKit.AzureTalk.Contract

    ''' <summary>
    ''' Contains information related to the session.
    ''' </summary>
    <DataContract(Name := "ClientInformation", Namespace := "urn:WindowsAzurePlatformKit:Labs:AzureTalk:2009:10:schemas")> _
    Friend Class SessionInformation
        Inherits ClientInformation
        ''' <summary>Gets or sets the callback channel for client notifications.</summary>
        Private privateCallback As IClientNotification
        <IgnoreDataMember> _
        Public Property Callback() As IClientNotification
            Get
                Return privateCallback
            End Get
            Set(ByVal value As IClientNotification)
                privateCallback = value
            End Set
        End Property
    End Class
End Namespace