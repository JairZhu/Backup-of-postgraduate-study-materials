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

namespace ContactManager.Web.Models
{
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    public class Contact
    {
        public int Id { get; set; }

        [Required]
        [DisplayName("First Name")]
        public string FirstName { get; set; }

        [DisplayName("Last Name")]
        [Required]
        public string LastName { get; set; }

        [DataType(DataType.EmailAddress)]
        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "Must have a minimum length of 3.")]
        public string Company { get; set; }

        [DisplayName("Business Phone")]
        [DataType(DataType.PhoneNumber)]
        public string BusinessPhone { get; set; }

        [DisplayName("Mobile Phone")]
        [DataType(DataType.PhoneNumber)]
        public string MobilePhone { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "Must have a minimum length of 3.")]
        [DataType(DataType.Text)]
        public string Address { get; set; }

        [StringLength(50, MinimumLength = 3, ErrorMessage = "Must have a minimum length of 3.")]
        [DataType(DataType.Text)]
        public string City { get; set; }

        [StringLength(10)]
        [DataType(DataType.Text)]
        public string Zip { get; set; }
    }
}