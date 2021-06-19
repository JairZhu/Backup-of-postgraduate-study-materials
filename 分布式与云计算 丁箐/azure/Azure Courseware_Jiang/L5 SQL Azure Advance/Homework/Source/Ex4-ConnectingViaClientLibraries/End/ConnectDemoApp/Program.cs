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

namespace ConnectDemoApp
{
    public class Program
    {
        /// <summary>
        /// Connection Variables. Please replace the values with those discussed in the lab.
        /// </summary>
        private static string userName = "[USERNAME]";
        private static string password = "[PASSWORD]";
        private static string datasource = "[SERVERNAME].database.windows.net";
        private static string databaseName = "HoLTestDB";

        public static void Main(string[] args)
        {
            // Invoke the ADO.NET connection demo
            Console.WriteLine("Starting the ADO.NET Connection Demo...");
            AdoConnectionDemo demo1 = new AdoConnectionDemo();
            demo1.ConnectToSQLDatabase(userName, password, datasource, databaseName);
            Console.WriteLine("Demo Complete... Press any key");
            Console.ReadKey();

            // Invoke the ODBC connection demo
            Console.WriteLine("Starting the ODBC Connection Demo...");
            OdbcConnectionDemo demo2 = new OdbcConnectionDemo();
            demo2.ConnectToSQLDatabase(userName, password, datasource, databaseName);
            Console.WriteLine("Demo Complete... Press any key");
            Console.ReadKey();

            // Invoke the OleDB connection demo
            Console.WriteLine("Starting the OLEDB Connection Demo…");
            OleDbConnectionDemo demo3 = new OleDbConnectionDemo();
            demo3.ConnectToSQLDatabase(userName, password, datasource, databaseName);
            Console.WriteLine("Demo Complete... Press any key");
            Console.ReadKey();

            // Invoke the Entity Framework connection demo
            Console.WriteLine("Starting the Entity Framework Connection Demo...");
            EFConnectionDemo demo4 = new EFConnectionDemo();
            demo4.ConnectToSQLDatabase();
            Console.WriteLine("Demo Complete... Press any key");
            Console.ReadKey();
        }
    }
}