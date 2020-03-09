using System;
using System.Collections.Generic;

namespace DocFrontend.Models
{
    public class User
    {
        
        public int UserID { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }
        public int RoleID { get; set; }
    }

    public class LoginUser
    {
        public string Email { get; set; }
        public string Password { get; set; }

    }

    public class UserGrid
    {
        
        public int UserID { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string RoleName { get; set; }
    }
}
