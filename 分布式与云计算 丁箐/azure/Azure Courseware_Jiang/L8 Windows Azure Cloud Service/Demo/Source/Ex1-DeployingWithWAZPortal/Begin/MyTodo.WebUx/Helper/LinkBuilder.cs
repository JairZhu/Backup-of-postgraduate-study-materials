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

namespace MyTodo.WebUx.Helper
{
    using System;
    using System.Linq.Expressions;
    using System.Reflection;
    using System.Web.Mvc;
    using System.Web.Routing;

    internal static class LinkBuilder
    {
        public static string BuildUrlFromExpression<TController>(RequestContext context, RouteCollection routeCollection, Expression<Action<TController>> action) where TController : Controller
        {
            RouteValueDictionary routeValuesFromExpression = GetRouteValuesFromExpression<TController>(action);
            VirtualPathData virtualPath = routeCollection.GetVirtualPath(context, routeValuesFromExpression);
            if (virtualPath != null)
            {
                return virtualPath.VirtualPath;
            }

            return null;
        }

        private static RouteValueDictionary GetRouteValuesFromExpression<TController>(Expression<Action<TController>> action) where TController : Controller
        {
            if (action == null)
            {
                throw new ArgumentNullException("action");
            }

            MethodCallExpression body = action.Body as MethodCallExpression;
            if (body == null)
            {
                throw new ArgumentException("Expression must be a method call.", "action");
            }

            string name = typeof(TController).Name;
            if (!name.EndsWith("Controller", StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("Controller name must end in 'Controller'.", "action");
            }

            name = name.Substring(0, name.Length - "Controller".Length);
            if (name.Length == 0)
            {
                throw new ArgumentException("Cannot route to class named 'Controller'.", "action");
            }

            RouteValueDictionary rvd = new RouteValueDictionary();
            rvd.Add("Controller", name);
            rvd.Add("Action", body.Method.Name);
            AddParameterValuesFromExpressionToDictionary(rvd, body);
            return rvd;
        }

        private static void AddParameterValuesFromExpressionToDictionary(RouteValueDictionary rvd, MethodCallExpression call)
        {
            ParameterInfo[] parameters = call.Method.GetParameters();
            if (parameters.Length > 0)
            {
                for (int i = 0; i < parameters.Length; i++)
                {
                    Expression expression = call.Arguments[i];
                    object obj2 = null;
                    ConstantExpression expression2 = expression as ConstantExpression;
                    if (expression2 != null)
                    {
                        obj2 = expression2.Value;
                    }
                    else
                    {
                        Expression<Func<object>> expression3 = Expression.Lambda<Func<object>>(Expression.Convert(expression, typeof(object)), new ParameterExpression[0]);
                        obj2 = expression3.Compile()();
                    }

                    rvd.Add(parameters[i].Name, obj2);
                }
            }
        }
    }
}
