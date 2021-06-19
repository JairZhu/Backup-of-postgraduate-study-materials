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
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web.Mvc;
    using System.Web.Routing;
    using Models;
    using MyTodo.WebUx.Helper;
    using Properties;

    [CacheFilter(Duration = -1)]
    public class TodoController : Controller
    {        
        private readonly TaskRepository repository;

        public TodoController()
            : this(null)
        {
        }

        public TodoController(TaskRepository repository)
        {
            this.repository = repository ?? new TaskRepository();            
        }

        public ActionResult GetTasks(string id)
        {
            TaskList list = this.repository.GetTaskList(id);

            if (list != null)
            {
                PagedTaskSource tasks = this.repository.GetTasks(id, 1000, null, null);
                return Json(tasks, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [AcceptVerbs(HttpVerbs.Post), Authorize(Roles = "Owner")]
        public ActionResult CreateTask(Task task)
        {
            if (task.StartDate == DateTime.MaxValue)
            {
                task.StartDate = DateTime.Now;
            }

            this.repository.CreateTask(task);
          
            return Json(task);
        }

        [AcceptVerbs(HttpVerbs.Put), Authorize(Roles = "Owner")]
        public ActionResult UpdateTask(Task task)
        {
            TaskList list = this.repository.GetTaskList(task.ListId);
            Task oldTask = this.repository.GetTask(task.TaskId, list.ListId);

            this.repository.UpdateTask(task);            

            return Json(task);
        }

        [AcceptVerbs(HttpVerbs.Delete), Authorize(Roles = "Owner")]
        public ActionResult DeleteTask(Task task)
        {
            this.repository.DeleteTask(task.ListId, task.TaskId);

            TaskList list = this.repository.GetTaskList(task.ListId);            

            return Json(true);
        }

        public ActionResult GetLists()
        {
            IEnumerable<TaskList> lists = new List<TaskList>();

            if (this.repository.TablesExist())
            {
                bool userIsInRole = User.IsInRole("Owner");

                lists = this.repository.GetTaskLists(userIsInRole);
            }

            return Json(lists, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post), Authorize(Roles = "Owner")]
        public ActionResult CreateList(TaskList taskList)
        {
            TaskList list = this.repository.CreateList(taskList.Name, taskList.IsPublic);

            return Json(list);
        }

        [AcceptVerbs(HttpVerbs.Put), Authorize(Roles = "Owner")]
        public ActionResult UpdateList(TaskList list)
        {
            TaskList taskList = this.repository.GetTaskList(list.ListId);

            this.repository.UpdateList(list);
            
            return Json(list);
        }

        [AcceptVerbs(HttpVerbs.Delete), Authorize(Roles = "Owner")]
        public ActionResult DeleteList(TaskList taskList)
        {
            this.repository.DeleteList(taskList.ListId);

            return Json(true);
        }

        public ActionResult Rss(string listId)
        {
            if (string.IsNullOrEmpty(listId))
            {
                IEnumerable<TaskList> lists = this.repository.GetTaskLists(User.IsInRole("Owner"));

                IList<FeedItem> feedItems = lists.Select(p => new FeedItem()
                {
                    Title = p.Name,
                    Description = p.IsPublic ? "Public list." : "Private list",
                    Url = new Uri(this.GetAbsoluteUrl(p.ListId)),
                }).ToList();

                var feed = new Feed(feedItems)
                {
                    Title = "Lists",
                };

                return this.View(feed);
            }
            else
            {
                TaskList list = this.repository.GetTaskList(listId);

                if (list != null && (Request.IsAuthenticated || list.IsPublic))
                {
                    PagedTaskSource tasks = this.repository.GetTasks(listId, 1000, null, null);

                    IList<FeedItem> feedItems = tasks.Tasks.Select(p => new FeedItem
                    {
                        Title = p.Subject,
                        Description = string.Concat(p.IsComplete ? "The task is completed" : "The task is pending", (!p.IsComplete && p.DueDate < DateTime.Now) ? " and overdue." : "."),
                        Url = new Uri(this.GetAbsoluteUrl(listId)),
                        Published = p.StartDate
                    }).ToList();

                    Feed feed = new Feed(feedItems)
                    {
                        Title = list.Name,
                        Description = "Is Public: " + list.IsPublic,
                        Url = new Uri(this.GetAbsoluteUrl(listId)),
                    };

                    return this.View(feed);
                }

                return new EmptyResult();
            }
        }

        protected virtual string GetAbsoluteUrl(string listId)
        {
            string path = LinkBuilder.BuildUrlFromExpression<HomeController>(
                this.ControllerContext.RequestContext,
                RouteTable.Routes,
                c => c.List(listId, null, null));

            return string.Concat(this.Request.Url.Scheme, "://", this.Request.ServerVariables["HTTP_HOST"], path);
        }        

        private static bool IsValidURL(string url)
        {
            if (url.ToLower().StartsWith("http://") || url.StartsWith("https://"))
            {
                return true;
            }

            return false;
        }

        private static string ShortenURL(string url)
        {
            if (!IsValidURL(url))
            {
                return string.Empty;
            }

            string requestUrl = string.Format(Resources.BitlyPattern, url);

            WebRequest request = HttpWebRequest.Create(requestUrl);
            request.Proxy = null;
            string resultUrl = null;

            try
            {
                using (Stream responseStream = request.GetResponse().GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.ASCII);
                    resultUrl = reader.ReadToEnd();

                    if (!IsValidURL(resultUrl))
                    {
                        WebException w = new WebException(resultUrl);

                        throw w;
                    }
                }
            }
            catch (Exception)
            {
                return url;
            }

            if (resultUrl.Length > url.Length)
            {
                resultUrl = url;
            }

            return resultUrl;
        }        
    }
}