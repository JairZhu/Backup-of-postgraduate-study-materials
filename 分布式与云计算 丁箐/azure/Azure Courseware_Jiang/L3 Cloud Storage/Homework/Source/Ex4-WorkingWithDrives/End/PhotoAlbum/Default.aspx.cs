// ----------------------------------------------------------------------------------
// Microsoft Developer & Platform Evangelism
// 
// Copyright (c) Microsoft Corporation. All rights reserved.
// 
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
// ----------------------------------------------------------------------------------
// The example companies, organizations, products, domain names,
// e-mail addresses, logos, people, places, and events depicted
// herein are fictitious.  No association with any real company,
// organization, product, domain name, email address, logo, person,
// places, or events is intended or should be inferred.
// ----------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace PhotoAlbum
{
    public partial class _Default : Page
    {
        protected string CurrentPath
        {
            get
            {
                string path = Request.Params["path"];
                if (string.IsNullOrEmpty(path))
                {
                    return Global.ImageStorePath;
                }

                return path;
            }
        }

        protected void LinqDataSource1_ContextCreating(object sender, LinqDataSourceContextEventArgs e)
        {
            e.ObjectInstance = new PhotoAlbumDataSource(this.CurrentPath);
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            this.GridView1.Columns[this.GridView1.Columns.Count - 1].Visible = this.CurrentPath != Global.ImageStorePath;

            if (RoleEnvironment.IsAvailable)
            {
                this.MountedDrives.DataSource = from item in CloudDrive.GetMountedDrives()
                                                select new
                                                {
                                                    Name = item.Key + " => " + item.Value,
                                                    Value = item.Key
                                                };

                this.MountedDrives.DataBind();
                this.MountedDrives.SelectedValue = this.CurrentPath;
                this.SelectDrive.Visible = true;

                this.NewDrive.Text = this.MountedDrives.Items.Count < 2 ? "New Drive" : "Delete Drive";
            }
        }

        protected void GridView1_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            if (e.CommandName == "Delete")
            {
                var index = Convert.ToInt32(e.CommandArgument);
                string fileName = ((GridView)e.CommandSource).DataKeys[index].Value as string;
                File.Delete(fileName);
                this.SelectImageStore(this.CurrentPath);
            }
        }

        private void SelectImageStore(string path)
        {
            Response.Redirect(this.Request.Path + "?path=" + path);
        }

        protected void NewDrive_Click(object sender, EventArgs e)
        {
            if (RoleEnvironment.IsAvailable)
            {
                // retrieve storage account
                CloudStorageAccount account = CloudStorageAccount.FromConfigurationSetting("DataConnectionString");

                // build page blob URI for the new cloud drive by changing the extension in the original URI
                string imageStoreBlobUri = RoleEnvironment.GetConfigurationSettingValue("ImageStoreBlobUri");
                string cloneStoreBlobUri = Path.ChangeExtension(imageStoreBlobUri, "bak");

                // create drive and its associated page blob
                CloudDrive clonedDrive = account.CreateCloudDrive(cloneStoreBlobUri);
                if (this.MountedDrives.Items.Count < 2)
                {
                    try
                    {
                        clonedDrive.Create(16);
                    }
                    catch (CloudDriveException)
                    {
                        // cloud drive already exists
                    }

                    // mount the drive and retrieve its path
                    LocalResource cache = RoleEnvironment.GetLocalResource("LocalDriveCache");
                    string clonedStorePath = clonedDrive.Mount(cache.MaximumSizeInMegabytes / 2, DriveMountOptions.None);

                    // copy the contents from the original drive to the new drive                
                    foreach (string sourceFileName in Directory.GetFiles(Global.ImageStorePath, "*.*").Where(name => name.EndsWith(".jpg") || name.EndsWith(".png")))
                    {
                        string destinationFileName = Path.Combine(clonedStorePath, Path.GetFileName(sourceFileName));
                        File.Copy(sourceFileName, destinationFileName, true);
                    }

                    this.SelectImageStore(clonedStorePath);
                }
                else
                {
                    clonedDrive.Unmount();
                    clonedDrive.Delete();
                    this.SelectImageStore(Global.ImageStorePath);
                }
            }
        }

        protected void MountedDrives_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.SelectImageStore(this.MountedDrives.SelectedValue);
        }
    }
}