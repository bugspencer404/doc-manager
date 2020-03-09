using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using DocFrontend.ModelOverride;

namespace DocFrontend.Pages
{
    public class UserModel : DocPageModel
    {
        private readonly ILogger<UserModel> _logger;

        public UserModel(ILogger<UserModel> logger)
        {
            _logger = logger;
        }
    }
}
