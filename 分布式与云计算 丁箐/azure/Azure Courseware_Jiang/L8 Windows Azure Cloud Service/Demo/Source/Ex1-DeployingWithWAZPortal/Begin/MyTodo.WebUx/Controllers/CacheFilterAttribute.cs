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
    using System.Web;
    using System.Web.Mvc;

    public class CacheFilterAttribute : ActionFilterAttribute
    {
        public CacheFilterAttribute()
        {
            this.Duration = 0;
        }

        public int Duration { get; set; }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (this.Duration == 0)
            {
                return;
            }

            HttpCachePolicyBase cache = filterContext.HttpContext.Response.Cache;

            if (this.Duration < 0)
            {
                cache.SetCacheability(HttpCacheability.NoCache);
                cache.SetExpires(DateTime.Now.AddDays(-1));
            }
            else
            {
                TimeSpan cacheDuration = TimeSpan.FromSeconds(this.Duration);
                cache.SetCacheability(HttpCacheability.Public);
                cache.SetExpires(DateTime.Now.Add(cacheDuration));
                cache.SetMaxAge(cacheDuration);
                cache.AppendCacheExtension("must-revalidate, proxy-revalidate");
            }
        }
    }
}