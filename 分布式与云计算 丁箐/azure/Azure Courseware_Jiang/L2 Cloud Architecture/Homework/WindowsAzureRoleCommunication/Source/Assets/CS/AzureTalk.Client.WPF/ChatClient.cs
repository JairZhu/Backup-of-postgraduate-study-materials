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
    using System.Collections.Generic;
    using System.ServiceModel;
    using WindowsAzurePlatformKit.AzureTalk.Contract;

    internal class ChatClient : IChatService
    {
        public interface IChatServiceChannel : IChatService, IClientChannel
        {
        }

        private ChannelFactory<IChatServiceChannel> factory;
        private IChatServiceChannel channel;

        public event EventHandler<ClientErrorEventArgs> Error;

        public ChatClient(IClientNotification callbackObject, string endpoint)
        {
            NetTcpBinding binding = new NetTcpBinding(SecurityMode.None, false);
            this.factory =
                new DuplexChannelFactory<IChatServiceChannel>(callbackObject, binding, endpoint);
        }

        public ClientInformation Register(string userName)
        {
            try
            {
                return this.Channel.Register(userName);
            }
            catch (TimeoutException timeoutException)
            {
                OnError("Failed to sign in. The service operation timed out. {0}", timeoutException.Message);
            }
            catch (CommunicationException communicationException)
            {
                OnError("Failed to sign in. There was a communication problem. {0}", communicationException.Message);
            }

            return null;
        }

        public void SendMessage(string message, string toUserName)
        {
            try
            {
                this.Channel.SendMessage(message, toUserName);
            }
            catch (TimeoutException timeoutException)
            {
                OnError("Failed to send the message. The service operation timed out. {0}", timeoutException.Message);
            }
            catch (CommunicationException communicationException)
            {
                OnError("Failed to send the message. There was a communication problem. {0}", communicationException.Message);
            }
        }

        public IEnumerable<ClientInformation> GetConnectedClients()
        {
            try
            {
                return this.Channel.GetConnectedClients();
            }
            catch (TimeoutException timeoutException)
            {
                OnError("Failed to retrieve the list of connected clients. The service operation timed out. {0}", timeoutException.Message);
            }
            catch (CommunicationException communicationException)
            {
                OnError("Failed to retrieve the list of connected clients. There was a communication problem. {0}", communicationException.Message);
            }

            return new ClientInformation[0];
        }

        public void Close()
        {
            try
            {
                if (this.channel != null)
                {
                    this.channel.Close();
                }
            }
            catch (TimeoutException)
            {
                this.channel.Abort();
            }
            catch (CommunicationException)
            {
                this.channel.Abort();
            }

            this.channel = null;
        }

        public IChatServiceChannel Channel
        {
            get
            {
                if (this.channel == null || this.channel.State == CommunicationState.Faulted)
                {
                    this.channel = this.factory.CreateChannel();
                    channel.Faulted += delegate(Object sender, EventArgs e)
                    {
                        this.channel.Abort();
                        this.channel = null;
                    };
                }
                return this.channel;
            }
        }

        private void OnError(string message, params object[] args)
        {
            if (Error != null)
            {
                Error(this, new ClientErrorEventArgs()
                {
                    Message = String.Format(message, args),
                    Cancel = false
                });
            }
        }

        public class ClientErrorEventArgs : EventArgs
        {
            public string Message { get; set; }
            public bool Cancel { get; set; }
        }
    }
}