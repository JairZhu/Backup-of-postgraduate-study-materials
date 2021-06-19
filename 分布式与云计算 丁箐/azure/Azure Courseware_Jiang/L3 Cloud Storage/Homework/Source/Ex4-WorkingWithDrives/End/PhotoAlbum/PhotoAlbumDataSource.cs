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

namespace PhotoAlbum
{
    using System.Collections.Generic;
    using System.IO;

    public class PhotoAlbumDataSource
    {
        private DirectoryInfo directoryInfo;

        public PhotoAlbumDataSource(string path)
        {
            this.directoryInfo = new DirectoryInfo(path);
        }

        public IEnumerable<FileInfo> Files
        {
            get
            {
                foreach (var fileInfo in this.directoryInfo.GetFiles("*.png"))
                {
                    yield return fileInfo;
                }

                foreach (var fileInfo in this.directoryInfo.GetFiles("*.jpg"))
                {
                    yield return fileInfo;
                }
            }
        }
    }
}