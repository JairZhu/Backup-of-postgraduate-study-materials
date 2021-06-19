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
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure.StorageClient.Protocol;

namespace RDImageGallery_WebRole
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!IsPostBack)
                {
                    this.EnsureContainerExists();
                }

                this.RefreshGallery();
            }
            catch (System.Net.WebException we)
            {
                this.status.Text = "Network error: " + we.Message;
                if (we.Status == System.Net.WebExceptionStatus.ConnectFailure)
                {
                    this.status.Text += "<br />Please check if the blob service is running at " +
                    ConfigurationManager.AppSettings["storageEndpoint"];
                }
            }
            catch (StorageException se)
            {
                Console.WriteLine("Storage service error: " + se.Message);
            }
        }

        protected void Upload_Click(object sender, EventArgs e)
        {
            if (this.imageFile.HasFile)
            {
                this.status.Text = "Inserted [" + this.imageFile.FileName + "] - Content Type [" + this.imageFile.PostedFile.ContentType + "] - Length [" + this.imageFile.PostedFile.ContentLength + "]";

                this.SaveImage(
                  Guid.NewGuid().ToString(),
                  this.imageName.Text,
                  this.imageDescription.Text,
                  this.imageTags.Text,
                  this.imageFile.FileName,
                  this.imageFile.PostedFile.ContentType,
                  this.imageFile.FileBytes);

                this.RefreshGallery();
            }
            else
            {
                this.status.Text = "No image file";
            }
        }

        /// <summary>
        /// Cast out blob instance and bind it's metadata to metadata repeater
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnBlobDataBound(object sender, ListViewItemEventArgs e)
        {
            if (e.Item.ItemType == ListViewItemType.DataItem)
            {
                var metadataRepeater = e.Item.FindControl("blobMetadata") as Repeater;
                var blob = ((ListViewDataItem)e.Item).DataItem as CloudBlob;

                // If this blob is a snapshot, rename button to "Delete Snapshot"
                if (blob != null)
                {
                    if (blob.SnapshotTime.HasValue)
                    {
                        var delBtn = e.Item.FindControl("deleteBlob") as LinkButton;

                        if (delBtn != null)
                        {
                            delBtn.Text = "Delete Snapshot";
                            var snapshotRequest = BlobRequest.Get(new Uri(delBtn.CommandArgument), 0, blob.SnapshotTime.Value, null);
                            delBtn.CommandArgument = snapshotRequest.RequestUri.AbsoluteUri;
                        }

                        var snapshotBtn = e.Item.FindControl("SnapshotBlob") as LinkButton;
                        if (snapshotBtn != null)
                        {
                            snapshotBtn.Visible = false;
                        }
                    }

                    if (metadataRepeater != null)
                    {
                        // bind to metadata
                        metadataRepeater.DataSource = from key in blob.Metadata.AllKeys
                                                      select new
                                                      {
                                                          Name = key,
                                                          Value = blob.Metadata[key]
                                                      };
                        metadataRepeater.DataBind();
                    }
                }
            }
        }

        /// <summary>
        /// Delete an image blob by Uri
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnDeleteImage(object sender, CommandEventArgs e)
        {
            try
            {
                if (e.CommandName == "Delete")
                {
                    var blobUri = (string)e.CommandArgument;
                    var blob = this.GetContainer().GetBlobReference(blobUri);
                    blob.DeleteIfExists();
                }
            }
            catch (StorageClientException se)
            {
                this.status.Text = "Storage client error: " + se.Message;
            }
            catch (Exception)
            {
            }

            this.RefreshGallery();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnCopyImage(object sender, CommandEventArgs e)
        {
            if (e.CommandName == "Copy")
            {
                // Prepare an Id for the copied blob
                var newId = Guid.NewGuid();

                // Get source blob
                var blobUri = (string)e.CommandArgument;
                var srcBlob = this.GetContainer().GetBlobReference(blobUri);

                // Create new blob
                var newBlob = this.GetContainer().GetBlobReference(newId.ToString());

                // Copy content from source blob
                newBlob.CopyFromBlob(srcBlob);

                // Explicitly get metadata for new blob
                newBlob.FetchAttributes(new BlobRequestOptions { BlobListingDetails = BlobListingDetails.Metadata });

                // Change metadata on the new blob to reflect this is a copy via UI
                newBlob.Metadata["ImageName"] = "Copy of \"" + newBlob.Metadata["ImageName"] + "\"";
                newBlob.Metadata["Id"] = newId.ToString();
                newBlob.SetMetadata();

                // Render all blobs
                this.RefreshGallery();
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void OnSnapshotImage(object sender, CommandEventArgs e)
        {
            if (e.CommandName == "Snapshot")
            {
                // Get source blob
                var blobUri = (string)e.CommandArgument;
                var srcBlob = this.GetContainer().GetBlobReference(blobUri);

                // Create a snapshot
                var snapshot = srcBlob.CreateSnapshot();

                this.status.Text = "A snapshot has been taken for image blob:" + srcBlob.Uri + " at " + snapshot.SnapshotTime;

                this.RefreshGallery();
            }
        }

        private void EnsureContainerExists()
        {
            var container = this.GetContainer();
            container.CreateIfNotExist();

            var permissions = container.GetPermissions();
            permissions.PublicAccess = BlobContainerPublicAccessType.Container;
            container.SetPermissions(permissions);
        }

        private CloudBlobContainer GetContainer()
        {
            // Get a handle on account, create a blob service client and get container proxy
            var account = CloudStorageAccount.FromConfigurationSetting("DataConnectionString");
            var client = account.CreateCloudBlobClient();

            return client.GetContainerReference(RoleEnvironment.GetConfigurationSettingValue("ContainerName"));
        }

        private void RefreshGallery()
        {
            this.images.DataSource =
              this.GetContainer().ListBlobs(new BlobRequestOptions()
              {
                  UseFlatBlobListing = true,
                  BlobListingDetails = BlobListingDetails.All
              });
            this.images.DataBind();
        }

        private void SaveImage(string id, string name, string description, string tags, string fileName, string contentType, byte[] data)
        {
            // Create a blob in container and upload image bytes to it
            var blob = this.GetContainer().GetBlobReference(name);

            blob.Properties.ContentType = contentType;

            // Create some metadata for this image
            var metadata = new NameValueCollection();
            metadata["Id"] = id;
            metadata["Filename"] = fileName;
            metadata["ImageName"] = string.IsNullOrEmpty(name) ? "unknown" : name;
            metadata["Description"] = string.IsNullOrEmpty(description) ? "unknown" : description;
            metadata["Tags"] = string.IsNullOrEmpty(tags) ? "unknown" : tags;

            // Add and commit metadata to blob
            blob.Metadata.Add(metadata);
            blob.UploadByteArray(data);
        }
    }
}