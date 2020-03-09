using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace DocFrontend.Models
{
    public class Document
    {
        public int DocumentID { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public int Approved { get; set; }
        public int ProjectID { get; set; }

    }

    public class DocumentGrid
    {
        public int DocumentID { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public int Approved { get; set; }
        public string ProjectName { get; set; }

    }

    public class FileInputModel
    {
        public string title { get; set; }
        public IFormFile document { get; set; }
    }

}
