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

namespace WindowsAzurePlatformKit.AzureTalk.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using WindowsAzurePlatformKit.AzureTalk.Contract;

    /// <summary>
    /// Manages sessions for users connected to the role. Maintains a thread-safe dictionary of active sessions.
    /// </summary>
    internal class SessionManager
    {
        /// <summary>Controls access to the session dictionary.</summary>
        private static ReaderWriterLockSlim sessionLock = new ReaderWriterLockSlim();

        /// <summary>Contains information about all active sessions.</summary>
        private static Dictionary<string, SessionInformation> sessions = new Dictionary<string, SessionInformation>();

        /// <summary>
        /// Retrieves a session.
        /// </summary>
        /// <param name="sessionId">The ID of the session.</param>
        /// <returns>The SessionInformation object representing the session.</returns>
        public static SessionInformation GetSession(string sessionId)
        {
            if (sessionId == null)
            {
                throw new ArgumentNullException("sessionId");
            }

            sessionLock.EnterReadLock();
            try
            {
                SessionInformation session;
                sessions.TryGetValue(sessionId, out session);
                return session;
            }
            finally
            {
                sessionLock.ExitReadLock();
            }
        }

        /// <summary>
        /// Updates a session.
        /// </summary>
        /// <param name="sessionId">The ID of the session.</param>
        /// <param name="userName">The name of the user.</param>
        /// <param name="roleId">The ID of the role where the session was started.</param>
        /// <param name="callback">The callback channel to the client; null for remote sessions.</param>
        /// <param name="session">When this method returns, contains the SessionInformation object representing the session.</param>
        /// <returns>true if the session is new or false if the session was updated.</returns>
        public static bool CreateOrUpdateSession(string sessionId, string userName, string roleId, IClientNotification callback, out SessionInformation session)
        {
            if (String.IsNullOrEmpty(userName))
            {
                throw new ArgumentException("sessionId");
            }

            if (String.IsNullOrEmpty(userName))
            {
                throw new ArgumentException("userName");
            }

            if (String.IsNullOrEmpty(roleId))
            {
                throw new ArgumentException("roleId");
            }

            sessionLock.EnterWriteLock();
            try
            {
                bool isNewSession = !sessions.TryGetValue(sessionId, out session);
                if (isNewSession)
                {
                    session = new SessionInformation();
                    sessions.Add(sessionId, session);
                }

                session.SessionId = sessionId;
                session.UserName = userName;
                session.RoleId = roleId;
                session.Callback = callback;
                session.IsActive = true;

                return isNewSession;
            }
            finally
            {
                sessionLock.ExitWriteLock();
            }
        }

        /// <summary>
        /// Removes a session from the active sessions list.
        /// </summary>
        /// <param name="sessionId">The ID of the session.</param>
        public static void RemoveSession(string sessionId)
        {
            if (sessionId == null)
            {
                throw new ArgumentNullException("sessionId");
            }

            sessionLock.EnterWriteLock();
            try
            {
                SessionInformation session;
                if (sessions.TryGetValue(sessionId, out session))
                {
                    session.IsActive = false;
                    sessions.Remove(sessionId);
                }
            }
            finally
            {
                sessionLock.ExitWriteLock();
            }
        }

        /// <summary>
        /// Retrieves a list of active sessions.
        /// </summary>
        /// <returns>A list of SessionInformation objects.</returns>
        public static IEnumerable<SessionInformation> GetActiveSessions()
        {
            sessionLock.EnterReadLock();
            try
            {
                return sessions.Values.Where(session => session.IsActive).ToArray();
            }
            finally
            {
                sessionLock.ExitReadLock();
            }
        }
    }
}