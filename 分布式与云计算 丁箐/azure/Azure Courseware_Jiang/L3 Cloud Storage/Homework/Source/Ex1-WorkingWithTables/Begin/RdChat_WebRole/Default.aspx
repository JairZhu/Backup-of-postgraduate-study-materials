<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="RdChat_WebRole._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h2>Working with Tables</h2>
            </hgroup>
            <p>
                Windows Azure tables store data as collections of entities, which are similar to rows in a database. An entity has a primary key and a set of properties composed by a name/value pair, similar to a column.</p>
            <p>
                Please, insert your name and a message to see how the tables storage works.</p>
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <style type="text/css">
        body { font-family: Verdana; font-size: 9pt; }
        h1 { font-size: 12pt; color: #555555; }
        li { list-style-type: none; }
		ul { padding: 0px; }
        form { background-color: #eeeeff; width: 80%; margin: 0 auto; padding: 1em; border: solid 1px #333333; }
        #entryform, #messages { margin: 1em 0 }
        #entryform li span { float: left; width: 15%; color:#333333; margin-top:1em; }
        #entryform input[type="text"] { border: solid 1px #999999; }
        #messages { border: solid 1px #999999; }
        #messages li { padding: 0.5em; }
        .error { color: #ff0000; }
        .even { background-color: #80bddb;; }
        .odd { background-color: #ffffff; font-style: italic; }        
        .messageBox { width: 300px; }
        #submitButton { font-size:10pt; }
        
    </style>
        <h1>Windows Azure Chat</h1>
        <ul id="entryform">
            <li><span>Your name</span><asp:TextBox ID="nameBox" runat="server" Text="Anonymous" /></li>
            <li><span>Message</span><asp:TextBox ID="messageBox" runat="server" CssClass="messageBox" TextMode="MultiLine" Rows="5" /></li>
            <li><span></span><asp:Button ID="submitButton" runat="server" Text="Submit" OnClick="SubmitButton_Click" /></li>
        </ul>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <div><asp:Label ID="status" runat="server" CssClass="error" /></div>
                <asp:ListView ID="messageList" runat="server">
                    <LayoutTemplate>
                        <ul id="messages">
                            <li ID="itemPlaceholder" runat="server" />
                        </ul>
                    </LayoutTemplate>
                    <ItemTemplate>
                        <li class="even">
                            <%# Eval("Name") %> said: <%# Eval("Body") %>
                        </li>
                    </ItemTemplate>
                    <AlternatingItemTemplate>
                        <li class="odd">
                            <%# Eval("Name") %> said: <%# Eval("Body") %>
                        </li>
                    </AlternatingItemTemplate>
                </asp:ListView>    
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="submitButton" />
            </Triggers>
        </asp:UpdatePanel>
</asp:Content>
