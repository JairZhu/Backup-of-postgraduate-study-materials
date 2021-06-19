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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PhotoAlbum
{
    public partial class _Default : Page
    {
        protected string CurrentPath
        {
            get
            {
                string path = Request.Params["path"];
                if (string.IsNullOrEmpty(path))
                {
                    return Global.ImageStorePath;
                }

                return path;
            }
        }

        protected void LinqDataSource1_ContextCreating(object sender, LinqDataSourceContextEventArgs e)
        {
            e.ObjectInstance = new PhotoAlbumDataSource(this.CurrentPath);
        }

        protected void Page_PreRender(object sender, EventArgs e)
        {
            this.GridView1.Columns[this.GridView1.Columns.Count - 1].Visible = this.CurrentPath != Global.ImageStorePath;
        }

        protected void GridView1_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            if (e.CommandName == "Delete")
            {
                var index = Convert.ToInt32(e.CommandArgument);
                string fileName = ((GridView)e.CommandSource).DataKeys[index].Value as string;
                File.Delete(fileName);
                this.SelectImageStore(this.CurrentPath);
            }
        }

        private void SelectImageStore(string path)
        {
            Response.Redirect(this.Request.Path + "?path=" + path);
        }
    }
}