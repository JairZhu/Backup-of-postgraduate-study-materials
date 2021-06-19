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
    using Microsoft.WindowsAzure.StorageClient;

    public class TaskRow : TableServiceEntity
    {
        public TaskRow()
        {
        }

        public TaskRow(string partitionKey, string rowKey)
            : base(partitionKey, rowKey)
        {
        }

        public string TaskId { get; set; }

        public string ListId { get; set; }

        public string Subject { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsComplete { get; set; }
    }
}