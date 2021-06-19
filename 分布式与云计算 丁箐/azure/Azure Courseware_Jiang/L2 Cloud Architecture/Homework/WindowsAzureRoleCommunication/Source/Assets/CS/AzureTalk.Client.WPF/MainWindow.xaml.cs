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

namespace WindowsAzurePlatformKit.AzureTalk.Client
{
    using System;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Reflection;
    using System.ServiceModel;
    using System.Threading;
    using System.Windows;
    using System.Windows.Controls;
    using WindowsAzurePlatformKit.AzureTalk.Contract;

    /// <summary>
    /// WPF Chat Client for Inter-Role Communication HOL
    /// </summary>
    [CallbackBehavior(UseSynchronizationContext = false)]
    public partial class MainWindow : Window, IClientNotification
    {
        private ChatClient client;
        private ClientInformation currentSession;
        private SynchronizationContext context;
        private Timer keepAliveTimer;
        private ObservableCollection<ClientInformation> userList;

        public MainWindow()
        {
            InitializeComponent();
            this.context = SynchronizationContext.Current;
        }

        protected override void OnClosed(EventArgs e)
        {
            base.OnClosed(e);

            if (this.keepAliveTimer != null)
            {
                this.keepAliveTimer.Dispose();
            }

            if (this.client != null)
            {
                this.client.Close();
            }
        }

        private void OnConnect(object sender, RoutedEventArgs e)
        {
            try
            {
                if (currentSession == null)
                {
                    string userName = this.userNameTextBox.Text;
                    this.client = new ChatClient(this, this.endPointTextBox.Text);
                    this.client.Error += (s, ea) => { ShowError(ea.Message); };
                    this.currentSession = this.client.Register(userName);
                    if (this.currentSession != null)
                    {
                        this.keepAliveTimer = new System.Threading.Timer((state) =>
                        {
                            this.client.Register(userName);
                        }, null, 55000, 55000);

                        this.Title = String.Format("{0} - {1} in worker role {2}", Assembly.GetEntryAssembly().GetName().Name, this.userNameTextBox.Text, this.currentSession.RoleId);
                        this.connectButton.Content = "Sign out";
                        this.userNameTextBox.IsEnabled = false;
                        this.endPointTextBox.IsEnabled = false;
                        RefreshUsers();
                    }
                }
                else
                {
                    this.keepAliveTimer.Dispose();
                    this.client.Close();
                    this.currentSession = null;
                    this.messages.Document.Blocks.Clear();
                    this.userList.Clear();
                    this.Title = Assembly.GetEntryAssembly().GetName().Name;
                    this.connectButton.Content = "Sign in";
                    this.userNameTextBox.IsEnabled = true;
                    this.endPointTextBox.IsEnabled = true;
                }
            }
            catch (Exception ex)
            {
                ShowError(ex.Message);
            }
        }

        private void UpdateConversation(string message, string fromUserName)
        {
            this.context.Post(state => this.AddMessage(message, fromUserName), null);
        }

        private void RefreshUsers()
        {
            var onlineUsers = this.client.GetConnectedClients().Where(p => p.UserName != this.userNameTextBox.Text);
            this.userList = new ObservableCollection<ClientInformation>(onlineUsers);
            this.DataContext = this.userList;
        }

        private void AddMessage(string message, string fromUserName)
        {
            this.messages.AppendText(String.Format("{0} says: {1}", fromUserName, message));
            this.messages.AppendText("\r\n");
            this.messages.ScrollToEnd();
        }

        private void OnSend(object sender, RoutedEventArgs e)
        {
            ClientInformation toUser = (ClientInformation) usersListView.SelectedItem;
            if (toUser == null)
            {
                MessageBox.Show("Please choose a user to send the message.");
                return;
            }

            string message = this.messageTextBox.Text;
            AddMessage(message, this.currentSession.UserName);
            this.client.SendMessage(message, toUser.SessionId);
            this.messageTextBox.Text = String.Empty;
        }

        #region IClientNotification Members

        public void DeliverMessage(string message, string fromSessionId, string toSessionId)
        {
            this.context.Post(state =>
            {
                var fromSession = this.userList.FirstOrDefault(userInfo => userInfo.SessionId == fromSessionId);
                if (fromSession != null)
                {
                    this.AddMessage(message, fromSession.UserName);
                }
                else
                {
                    ShowError("A message was received from an unknown sender. The session ID '{0}' is not registered.", fromSessionId);
                }
            }, null);
        }

        public void UpdateClientList(ClientInformation session)
        {
            this.context.Post(state =>
            {
                if (session.UserName == this.userNameTextBox.Text)
                {
                    return;
                }

                var client = this.userList.FirstOrDefault(userInfo => userInfo.SessionId == session.SessionId);
                if (session.IsActive)
                {
                    if (client == null)
                    {
                        this.userList.Add(session);
                        this.messages.AppendText(String.Format("User '{0}' has joined the chat.", session.UserName));
                        this.messages.AppendText("\r\n");
                    }
                    else
                    {
                        client.UserName = session.UserName;
                        client.RoleId = session.RoleId;
                    }
                }
                else
                {
                    if (client != null)
                    {
                        this.userList.Remove(client);
                        this.messages.AppendText(String.Format("User '{0}' has left the chat.", client.UserName));
                        this.messages.AppendText("\r\n");
                    }
                }
            }, null);
        }

        #endregion

        private void ShowError(string message, params object[] args)
        {
            MessageBox.Show(String.Format(message, args), "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }

        private void OnConnectionParametersChanged(object sender, TextChangedEventArgs e)
        {
            if (this.IsInitialized)
            {
                this.connectButton.IsEnabled = !(String.IsNullOrEmpty(this.endPointTextBox.Text)
                                                || String.IsNullOrEmpty(this.userNameTextBox.Text));
            }
        }

        private void OnMessageTextChanged(object sender, TextChangedEventArgs e)
        {
            this.sendButton.IsEnabled = !String.IsNullOrEmpty(this.messageTextBox.Text) && (this.currentSession != null);
        }
    }
}