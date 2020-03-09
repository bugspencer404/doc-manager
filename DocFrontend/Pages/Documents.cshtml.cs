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
    public class DocumentModel : DocPageModel
    {
        private readonly ILogger<DocumentModel> _logger;

        public DocumentModel(ILogger<DocumentModel> logger)
        {
            _logger = logger;
        }
    }
}
