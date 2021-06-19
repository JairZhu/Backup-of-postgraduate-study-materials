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

namespace MyTodo.Data.WindowsAzure
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;

    public class TaskDataContext : TableServiceContext
    {
        public const string TaskTable = "Tasks";
        public const string TaskListTable = "TaskLists";
        private readonly Dictionary<string, Type> resolverTypes;

        public TaskDataContext()
            : this(
                CloudStorageAccount.FromConfigurationSetting("DataConnectionString").TableEndpoint.AbsoluteUri,
                CloudStorageAccount.FromConfigurationSetting("DataConnectionString").Credentials)
        {
        }

        public TaskDataContext(string baseAddress, StorageCredentials credentials)
            : base(baseAddress, credentials)
        {
            // we are setting up a dictionary of types to resolve in order
            // to workaround a performance bug in astoria during serialization
            this.resolverTypes = new Dictionary<string, Type>();
            this.resolverTypes.Add(TaskTable, typeof(TaskRow));
            this.resolverTypes.Add(TaskListTable, typeof(TaskListRow));

            this.ResolveType = name =>
            {
                var parts = name.Split('.');
                if (parts.Length == 2)
                {
                    return resolverTypes.FirstOrDefault(t => t.Key == parts[1]).Value;
                }

                return null;
            };
        }

        public bool IsTablesCreated
        {
            get
            {
                var client = new CloudTableClient(this.BaseUri.AbsoluteUri, this.StorageCredentials);
                return client.DoesTableExist(TaskTable) && client.DoesTableExist(TaskListTable);
            }
        }

        public IQueryable<TaskRow> Tasks
        {
            get
            {
                return this.CreateQuery<TaskRow>(TaskTable);
            }
        }

        public IQueryable<TaskListRow> TaskLists
        {
            get
            {
                return this.CreateQuery<TaskListRow>(TaskListTable);
            }
        }

        public void CreateTables()
        {
            TableStorageExtensionMethods.CreateTablesFromModel(typeof(TaskDataContext), this.BaseUri.AbsoluteUri, this.StorageCredentials);
        }
    }
}