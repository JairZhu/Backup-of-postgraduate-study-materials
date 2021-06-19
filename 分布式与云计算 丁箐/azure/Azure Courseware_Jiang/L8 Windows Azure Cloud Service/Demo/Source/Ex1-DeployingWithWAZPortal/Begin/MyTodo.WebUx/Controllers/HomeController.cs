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

namespace MyTodo.WebUx.Controllers
{
    using System.Web.Mvc;
    using System.Web.Security;
    using MyTodo.WebUx.Models;

    [HandleError]
    public class HomeController : Controller
    {
        private readonly TaskRepository repository;

        public HomeController()
            : this(null)
        {
        }

        public HomeController(TaskRepository taskRepository)
        {
            this.repository = taskRepository ?? new TaskRepository();
        }

        public ActionResult Index()
        {
            if (this.repository.TablesExist() && Roles.RoleExists("Owner"))
            {
                ViewData.Add("AuthenticatedUser", User.IsInRole("Owner"));
                return this.View("Lists");
            }
            else
            {
                return this.View("Welcome");
            }
        }

        public ActionResult List(string listId, string page, string row)
        {
            TaskList list = this.repository.GetTaskList(listId);

            if (list != null && (Request.IsAuthenticated || list.IsPublic))
            {
                ViewData.Add("ListId", list.ListId);
                ViewData.Add("ListName", list.Name);
                ViewData.Add("AuthenticatedUser", User.IsInRole("Owner"));
                return View("Tasks");
            }

            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            return this.View();
        }
    }
}
