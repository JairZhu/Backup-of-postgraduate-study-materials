<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PhotoAlbum._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1>Working with Drives</h1>
            </hgroup>
            <p>Windows Azure Drive is an NTFS formatted virtual hard disk (VHD) file that is stored in a page blob. You can mount this VHD into a Windows Azure Compute instance to provide persistent storage exposed to applications via the Windows file system. The content of an Azure Drive will persist even if the compute role to which it is mounted is recycled.</p>
        </div>
    </section>    
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <style type="text/css">
        body {
            font-family: Tahoma, Verdana;
            font-size: 10pt;
        }
        h1 { font-size: 18pt; color: #666}
        h3 { font-size: 12pt; margin-bottom:0.4em}
        .newdrive { float: right}
        th { padding-left: 10px; }
        td { padding-left: 10px; }
    </style>
    
    <div>
        <h1>PhotoAlbum</h1>
        <asp:Panel ID="SelectDrive" runat="server" Visible="false">
        <asp:LinkButton ID="NewDrive" runat="server" Text="New Drive" onclick="NewDrive_Click" CssClass="newdrive" />
        Mounted Drives: 
        <asp:DropDownList ID="MountedDrives" runat="server" AutoPostBack="true"
                        DataTextField="Name" DataValueField="Value"
                        OnSelectedIndexChanged="MountedDrives_SelectedIndexChanged" />
        </asp:Panel>
        <h3>Image Store Drive: (<%=this.CurrentPath%>)</h3>
        <asp:GridView DataSourceID="LinqDataSource1" AutoGenerateColumns="False" 
            ID="GridView1" runat="server" CellPadding="8" EnableModelValidation="True" 
            ForeColor="#333333" GridLines="None" Width="100%" DataKeyNames="FullName"
            EmptyDataText="No files available" onrowcommand="GridView1_RowCommand">
            <AlternatingRowStyle BackColor="White" />
            <Columns>
                <asp:BoundField DataField="Name" HeaderText="Name" ReadOnly="True" SortExpression="Name" >
                <HeaderStyle HorizontalAlign="Left" />
                </asp:BoundField>
                <asp:BoundField DataField="Length"  HeaderText="Length" ReadOnly="True" SortExpression="Length">
                <HeaderStyle HorizontalAlign="Left" />
                </asp:BoundField>
                <asp:BoundField DataField="CreationTime" HeaderText="Date Created" ReadOnly="True" SortExpression="CreationTime" >
                <HeaderStyle HorizontalAlign="Left" />
                </asp:BoundField>
                <asp:BoundField DataField="LastWriteTime" HeaderText="Last Updated" SortExpression="LastWriteTime">
                <HeaderStyle HorizontalAlign="Left" />
                </asp:BoundField>
                <asp:ButtonField ButtonType="Link" CommandName="Delete" Text="Delete" />
            </Columns>
            <EditRowStyle BackColor="#7C6F57" />
            <FooterStyle BackColor="#80bddb" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#80bddb" Font-Bold="True" ForeColor="White" />
            <PagerStyle BackColor="#666666" ForeColor="White" HorizontalAlign="Center" />
            <RowStyle BackColor="#E3EAEB" />
            <SelectedRowStyle BackColor="#C5BBAF" Font-Bold="True" ForeColor="#333333" />
        </asp:GridView>
        <asp:LinqDataSource ID="LinqDataSource1" runat="server" 
            OnContextCreating="LinqDataSource1_ContextCreating"
            TableName="Files" Select="new (Name, Length, CreationTime, LastWriteTime, FullName)">
        </asp:LinqDataSource>
    </div>
</asp:Content>
