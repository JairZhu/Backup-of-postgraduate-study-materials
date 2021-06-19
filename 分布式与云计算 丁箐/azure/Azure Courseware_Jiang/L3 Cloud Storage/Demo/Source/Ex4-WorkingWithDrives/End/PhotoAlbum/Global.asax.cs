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
using System.Linq;
using System.Web;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using PhotoAlbum;
using System.Web.Configuration;
using System.Diagnostics;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace PhotoAlbum
{
    public class Global : HttpApplication
    {
        private static string imageStorePath;

        public static string ImageStorePath
        {
            get
            {
                return imageStorePath;
            }

            set
            {
                imageStorePath = value;
            }
        }

        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterOpenAuth();

            if (imageStorePath == null)
            {
                ImageStorePath = WebConfigurationManager.AppSettings["ImageStorePath"];
            }

            // initialize storage account configuration setting publisher
            CloudStorageAccount.SetConfigurationSettingPublisher((configName, configSetter) =>
            {
                string connectionString = RoleEnvironment.GetConfigurationSettingValue(configName);
                configSetter(connectionString);
            });

            try
            {
                // initialize the local cache for the Azure drive
                LocalResource cache = RoleEnvironment.GetLocalResource("LocalDriveCache");
                CloudDrive.InitializeCache(cache.RootPath + "cache", cache.MaximumSizeInMegabytes);

                // retrieve storage account 
                CloudStorageAccount account = CloudStorageAccount.FromConfigurationSetting("DataConnectionString");

                // retrieve URI for the page blob that contains the cloud drive from configuration settings 
                string imageStoreBlobUri = RoleEnvironment.GetConfigurationSettingValue("ImageStoreBlobUri");
                
				// unmount any previously mounted drive.
				foreach (var drive in CloudDrive.GetMountedDrives())
				{
					var mountedDrive = new CloudDrive(drive.Value, account.Credentials);
					mountedDrive.Unmount();
				}
		
                // create the Windows Azure drive and its associated page blob
                CloudDrive imageStoreDrive = account.CreateCloudDrive(imageStoreBlobUri);

                if (CloudDrive.GetMountedDrives().Count == 0)
                {                  
                    try
                    {
                        imageStoreDrive.Create(16);
                    }
                    catch (CloudDriveException)
                    {
                        // drive already exists
                    }
                }

                // mount the drive and initialize the application with the path to the image store on the Azure drive
                Global.ImageStorePath = imageStoreDrive.Mount(cache.MaximumSizeInMegabytes / 2, DriveMountOptions.None);
            }
            catch (CloudDriveException driveException)
            {
                Trace.WriteLine("Error: " + driveException.Message);
            }
        }

        void Application_End(object sender, EventArgs e)
        {
            // obtain a reference to the cloud drive and unmount it
            CloudStorageAccount account = CloudStorageAccount.FromConfigurationSetting("DataConnectionString");
            string imageStoreBlobUri = RoleEnvironment.GetConfigurationSettingValue("ImageStoreBlobUri");
            CloudDrive imageStoreDrive = account.CreateCloudDrive(imageStoreBlobUri);
            imageStoreDrive.Unmount();
        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs

        }
    }
}
