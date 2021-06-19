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
using System.Web.Mvc;
using ContactManager.Web.Models;  

namespace ContactManager.Web.Controllers
{
    public class ContactController : Controller
    {
        // GET: /Contact/
        public ActionResult Index()
        {
            return this.RedirectToActionPermanent("List");
        }

        // GET: /Contact/List
        public ActionResult List(string searchQuery)
        {
            IEnumerable<Contact> contacts;

            using (ContactContext context = new ContactContext())
            {
                if (!string.IsNullOrEmpty(searchQuery))
                {
                    contacts = context.SearchContacts(searchQuery).ToList();
                }
                else
                {
                    contacts = context.Contacts.ToList();
                }
            }

            return View(contacts);
        }

        // GET: /Contact/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Contact/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return View(contact);
            }

            using (ContactContext context = new ContactContext())
            {
                context.Contacts.Add(contact);

                context.SaveChanges();
            }

            return this.RedirectToAction("List");
        }
    }
}
