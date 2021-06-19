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
    using System.Globalization;
    using System.Linq;
    using System.Security.Principal;
    using System.Web.Mvc;
    using System.Web.Security;
    using Authentication;
    using Models;
    using Properties;

    [HandleError]
    public class AccountController : Controller
    {
        // This constructor is used by the MVC framework to instantiate the controller using
        // the default forms authentication and membership providers.
        public AccountController()
            : this(null, null, null)
        {
        }

        // This constructor is not used by the MVC framework but is instead provided for ease
        // of unit testing this type. See the comments at the end of this file for more
        // information.
        public AccountController(IFormsAuthentication formsAuth, IMembershipService membershipService, TaskRepository taskRepository)
        {
            this.FormsAuth = formsAuth ?? new FormsAuthenticationService();
            this.MembershipService = membershipService ?? new AccountMembershipService();
            this.TaskRepository = taskRepository ?? new TaskRepository();
        }

        public IFormsAuthentication FormsAuth { get; private set; }

        public IMembershipService MembershipService { get; private set; }

        public TaskRepository TaskRepository { get; private set; }

        public ActionResult LogIn()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1054:UriParametersShouldNotBeStrings",
            Justification = "Needs to take same parameter type as Controller.Redirect()")]
        public ActionResult LogIn(string userName, string password, bool rememberMe, string returnUrl)
        {
            if (!this.ValidateLogIn(userName, password))
            {
                return View();
            }

            this.FormsAuth.SignIn(userName, rememberMe);
            if (!string.IsNullOrEmpty(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Task");
            }
        }

        public ActionResult LogOff()
        {
            this.FormsAuth.SignOut();

            return RedirectToAction("Index", "Task");
        }

        public ActionResult Register()
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Register(string userName, string email, string password, string confirmPassword)
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            // we are only letting a single user register on this site (ever)
            if (!Roles.RoleExists("Owner"))
            {
                if (this.ValidateRegistration(userName, email, password, confirmPassword))
                {
                    // Attempt to register the user
                    MembershipCreateStatus createStatus = this.MembershipService.CreateUser(userName, password, email);

                    if (createStatus == MembershipCreateStatus.Success)
                    {
                        // Provision the user role and tables.
                        Roles.CreateRole("Owner");
                        Roles.AddUserToRole(userName, "Owner");

                        this.TaskRepository.CreateTables();

                        this.FormsAuth.SignIn(userName, false /* createPersistentCookie */);

                        // Provision the Public Lists
                        this.CreateInitialLists();

                        return RedirectToAction("Index", "Task");
                    }
                    else
                    {
                        ModelState.AddModelError("_FORM", ErrorCodeToString(createStatus));
                    }
                }
            }
            else
            {
                ModelState.AddModelError("_FORM", "The Owner has already registered");
            }

            // If we got this far, something failed, redisplay form
            return View();
        }

        [Authorize]
        public ActionResult Profile()
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            return View();
        }

        [AcceptVerbs(HttpVerbs.Post), Authorize]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes",
            Justification = "Exceptions result in password not being changed.")]
        public ActionResult Profile(string currentPassword, string newPassword, string confirmPassword)
        {
            this.ViewData["PasswordLength"] = this.MembershipService.MinPasswordLength;

            if (!this.ValidateChangePassword(currentPassword, newPassword, confirmPassword))
            {
                return View();
            }

            try
            {
                if (!string.IsNullOrEmpty(newPassword))
                {
                    if (!this.MembershipService.ChangePassword(User.Identity.Name, currentPassword, newPassword))
                    {
                        ModelState.AddModelError("_FORM", "The current password is incorrect or the new password is invalid.");
                        return this.View();
                    }
                }

                return this.View("ProfileUpdateSuccess");
            }
            catch
            {
                ModelState.AddModelError("_FORM", "The current password is incorrect or the new password is invalid.");
                return View();
            }
        }

        public ActionResult ProfileUpdateSuccess()
        {
            return View();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.User.Identity is WindowsIdentity)
            {
                throw new InvalidOperationException("Windows authentication is not supported.");
            }
        }

        protected void CreateInitialLists()
        {
            var document = this.TaskRepository.RetrieveInitialLists();

            if (document.Nodes().Count() == 0)
            {
                return;
            }

            var todoController = new TodoController();
            todoController.ControllerContext = this.ControllerContext;

            foreach (var taskList in document.Descendants("TaskList"))
            {
                var taskListName = taskList.Element("Name").Value;
                var taskListIsPublic = bool.Parse(taskList.Element("IsPublic").Value);

                var createdTaskList = this.TaskRepository.CreateList(taskListName, taskListIsPublic);

                if (createdTaskList == null || string.IsNullOrEmpty(createdTaskList.ListId))
                {
                    return;
                }

                foreach (var task in taskList.Descendants("Task"))
                {
                    var newTask = new Task
                    {
                        ListId = createdTaskList.ListId,
                        Subject = task.Element("Subject").Value,
                        DueDate = string.IsNullOrEmpty(task.Element("DueDate").Value) ? DateTime.MaxValue : DateTime.Parse(task.Element("DueDate").Value, CultureInfo.InvariantCulture),
                        IsComplete = bool.Parse(task.Element("IsComplete").Value)
                    };

                    todoController.CreateTask(newTask);
                }
            }
        }

        // Validation Methods
        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://msdn.microsoft.com/en-us/library/system.web.security.membershipcreatestatus.aspx for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "Username already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A username for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }

        private bool ValidateChangePassword(string currentPassword, string newPassword, string confirmPassword)
        {
            if (!string.IsNullOrEmpty(currentPassword))
            {
                if (newPassword == null || newPassword.Length < this.MembershipService.MinPasswordLength)
                {
                    ModelState.AddModelError(
                        "newPassword",
                        string.Format(CultureInfo.CurrentCulture, "You must specify a new password of {0} or more characters.", this.MembershipService.MinPasswordLength));
                }

                if (!string.Equals(newPassword, confirmPassword, StringComparison.Ordinal))
                {
                    ModelState.AddModelError("_FORM", "The new password and confirmation password do not match.");
                }
            }

            return ModelState.IsValid;
        }

        private bool ValidateLogIn(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName))
            {
                ModelState.AddModelError("username", "You must specify a username.");
            }

            if (string.IsNullOrEmpty(password))
            {
                ModelState.AddModelError("password", "You must specify a password.");
            }

            if (!this.MembershipService.ValidateUser(userName, password))
            {
                ModelState.AddModelError("_FORM", "The username or password provided is incorrect.");
            }

            return ModelState.IsValid;
        }

        private bool ValidateRegistration(string userName, string email, string password, string confirmPassword)
        {
            if (string.IsNullOrEmpty(userName))
            {
                ModelState.AddModelError("username", "You must specify a username.");
            }

            if (string.IsNullOrEmpty(email))
            {
                ModelState.AddModelError("email", "You must specify an email address.");
            }

            if (password == null || password.Length < this.MembershipService.MinPasswordLength)
            {
                ModelState.AddModelError(
                    "password",
                    string.Format(CultureInfo.CurrentCulture, "You must specify a password of {0} or more characters.", this.MembershipService.MinPasswordLength));
            }

            if (!string.Equals(password, confirmPassword, StringComparison.Ordinal))
            {
                ModelState.AddModelError("_FORM", "The new password and confirmation password do not match.");
            }

            return ModelState.IsValid;
        }
    }
}