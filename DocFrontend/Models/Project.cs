using System;
using System.Collections.Generic;

namespace DocFrontend.Models
{
    public class Project
    {
        public int ProjectID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CustomerID { get; set; }

    }

    public class ProjectGrid
    {
        public int ProjectID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CustomerName { get; set; }

    }

    public class ProjectTag
    {
        public int id { get; set; }
        public string description { get; set; }
    }

}
