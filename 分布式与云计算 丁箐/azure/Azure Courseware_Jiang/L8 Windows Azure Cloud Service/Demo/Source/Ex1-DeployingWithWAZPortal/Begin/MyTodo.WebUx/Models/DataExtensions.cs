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
    using MyTodo.Data.WindowsAzure;

    public static class DataExtensions
    {
        public static TaskRow ToRow(this Task task)
        {
            return new TaskRow(task.ListId, task.TaskId)
            {
                TaskId = task.TaskId,
                ListId = task.ListId,
                DueDate = task.DueDate,
                IsComplete = task.IsComplete,
                StartDate = task.StartDate,
                Subject = task.Subject
            };
        }

        public static TaskListRow ToRow(this TaskList taskList)
        {
            return new TaskListRow(taskList.ListId.Substring(0, 1), taskList.ListId)
            {
                ListId = taskList.ListId,
                Name = taskList.Name,
                IsPublic = taskList.IsPublic
            };
        }

        public static TaskList ToModel(this TaskListRow row)
        {
            return new TaskList
            {
                Name = row.Name,
                IsPublic = row.IsPublic
            };
        }

        public static IEnumerable<TaskList> ToModel(this IEnumerable<TaskListRow> rows)
        {
            foreach (var row in rows)
            {
                yield return new TaskList
                {
                    Name = row.Name,
                    IsPublic = row.IsPublic
                };
            }
        }

        public static Task ToModel(this TaskRow task)
        {
            return new Task
            {
                TaskId = task.TaskId,
                ListId = task.ListId,
                DueDate = task.DueDate,
                IsComplete = task.IsComplete,
                StartDate = task.StartDate,
                Subject = task.Subject,
            };
        }

        public static IEnumerable<Task> ToModel(this IEnumerable<TaskRow> tasks)
        {
            foreach (var task in tasks)
            {
                yield return new Task
                {
                    TaskId = task.TaskId,
                    ListId = task.ListId,
                    DueDate = task.DueDate,
                    IsComplete = task.IsComplete,
                    StartDate = task.StartDate,
                    Subject = task.Subject,
                };
            }
        }
    }
}