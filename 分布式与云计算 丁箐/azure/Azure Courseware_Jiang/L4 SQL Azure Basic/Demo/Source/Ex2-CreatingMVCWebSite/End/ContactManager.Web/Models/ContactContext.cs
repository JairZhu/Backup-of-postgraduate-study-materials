﻿// ----------------------------------------------------------------------------------
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

namespace ContactManager.Web.Models
{
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.SqlClient;

    public class ContactContext : DbContext
    {
        public ContactContext()
            : base("ContactManagerDb")
        {
        }

        public DbSet<Contact> Contacts { get; set; }

        public IEnumerable<Contact> SearchContacts(string searchQuery)
        {
            return this.Database.SqlQuery<Contact>("EXECUTE [dbo].[SearchContacts] @searchQuery", new SqlParameter("searchQuery", searchQuery ?? string.Empty));
        }
    }
}