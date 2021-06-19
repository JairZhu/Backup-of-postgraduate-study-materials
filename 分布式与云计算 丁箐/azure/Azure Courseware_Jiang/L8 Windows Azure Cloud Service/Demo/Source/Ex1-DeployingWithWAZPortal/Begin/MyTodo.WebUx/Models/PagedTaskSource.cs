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

namespace MyTodo.WebUx.Models
{
    using System.Collections.Generic;
    using System.Data.Services.Client;
    using System.Linq;
    using MyTodo.Data.WindowsAzure;

    public class PagedTaskSource
    {
        public PagedTaskSource(IQueryable<TaskRow> source, string partition, string rowKey, int pageSize)
        {
            this.PageSize = pageSize;

            var query = source.Take(this.PageSize) as DataServiceQuery<TaskRow>;

            if (query != null)
            {
                if (partition != null && rowKey != null)
                {
                    query = query
                        .AddQueryOption("NextPartitionKey", partition)
                        .AddQueryOption("NextRowKey", rowKey);
                }

                // set the Tasks
                var res = query.Execute();
                this.Tasks = res.ToModel();

                // get the continuation markers
                string nextPartition;
                string nextRow;

                var headers = ((QueryOperationResponse)res).Headers;

                headers.TryGetValue("x-ms-continuation-NextPartitionKey", out nextPartition);
                headers.TryGetValue("x-ms-continuation-NextRowKey", out nextRow);

                // and return them to the client
                this.NextPartition = nextPartition;
                this.NextRow = nextRow;
            }
        }

        protected PagedTaskSource()
        {
        }

        public int PageSize { get; set; }

        public string NextPartition { get; private set; }

        public string NextRow { get; private set; }

        public virtual IEnumerable<Task> Tasks { get; private set; }
    }
}