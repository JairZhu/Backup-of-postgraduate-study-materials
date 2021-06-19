<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="RDImageGallery_WebRole._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
        <style type="text/css">
            body { font-family: Verdana; font-size: 12px; }
            h1 { font-size:x-large; font-weight:bold; }
            h2 { font-size:large; font-weight:bold; }
            img { width:200px; height:175px; margin:2em;}
            li { list-style: none; }
            ul { padding:1em; }
        
            .form { width:50em; }
            .form li span { width:20%; margin-right: 10px; font-weight:bold; }
            .form li input { width:350px; }
            .form li input[type="submit"] { width:120px; }
        
            .item { font-size:small; font-weight:bold; }
            .item ul li { padding:0.25em; background-color:rgb(226, 226, 226); }
            .item ul li span { padding:0.25em; background-color:#ffffff; display:block; font-style:italic; font-weight:normal; }
        </style>
    
        <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1>Working with Blobs</h1>
            </hgroup>
            <p>In this exercise, you will use the Windows Azure Blob Service API to create an application that saves and retrieves image data stored as blobs in Windows Azure storage. It consists of a simple image gallery Web site that can display, upload and remove images in Windows Azure storage, and allows you to enter and display related metadata.</p>
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <h3>Image Gallery (Windows Azure Blob Service)</h3>
    <div>
        <div class="form">
            <ul>
                <li><span>Name</span></li><li><asp:TextBox ID="imageName" runat="server"/></li>
                <li><span>Description</span></li><li><asp:TextBox ID="imageDescription" runat="server"/></li>
                <li><span>Tags</span></li><li><asp:TextBox ID="imageTags" runat="server"/></li>
                <li><span>Filename</span></li><li><asp:FileUpload ID="imageFile" runat="server" /></li>
				<li><span>&nbsp;</span></li><li><asp:Button ID="upload" runat="server" onclick="Upload_Click" Text="Upload Image" /></li>
            </ul>            
        </div>
		
        <div style=" float:left;">
            Status: <asp:Label ID="status" runat="server" />
        </div>
		
        <asp:ListView ID="images" runat="server">
            <LayoutTemplate>
                <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
            </LayoutTemplate>
            <EmptyDataTemplate>
                <h2>No Data Available</h2>
            </EmptyDataTemplate>
            <ItemTemplate>            
                <div class="item">
                    <ul style="width:40em;float:left;clear:left" >
                        <asp:Repeater ID="blobMetadata" runat="server">
                        <ItemTemplate>
                            <li><%# Eval("Name") %><span><%# Eval("Value") %></span></li>
                        </ItemTemplate>
                        </asp:Repeater>
                        <li>
                        <%--Uncomment to implement Delete blob function
                            <asp:LinkButton ID="deleteBlob" 
                                    OnClientClick="return confirm('Delete image?');"
                                    CommandName="Delete" 
                                    CommandArgument='<%# Eval("Uri")%>'
                                    runat="server" Text="Delete" oncommand="OnDeleteImage" />                       
                        --%>

                        <%--Uncomment to implement Copy blob function
                            <asp:LinkButton ID="CopyBlob" 
                                    OnClientClick="return confirm('Copy image?');"
                                    CommandName="Copy" 
                                    CommandArgument='<%# Eval("Uri")%>'
                                    runat="server" Text="Copy" oncommand="OnCopyImage" />
                        --%>

                        <%--Uncomment to implement Snapshot blob function
                            <asp:LinkButton ID="SnapshotBlob" 
                                    OnClientClick="return confirm('Snapshot image?');"
                                    CommandName="Snapshot" 
                                    CommandArgument='<%# Eval("Uri")%>'
                                    runat="server" Text="Snapshot" oncommand="OnSnapshotImage" />
                        --%>
                        </li>
                    </ul>
                    <img src="<%# Eval("Uri") %>" alt="<%# Eval("Uri") %>" style="float:left"/>
                </div>
            </ItemTemplate>
        </asp:ListView>
    </div>
</asp:Content>
