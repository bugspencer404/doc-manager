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
    public class CustomerModel : DocPageModel
    {
        private readonly ILogger<CustomerModel> _logger;

        public CustomerModel(ILogger<CustomerModel> logger)
        {
            _logger = logger;
        }
    }
}
