using System;
using System.Collections.Generic;

namespace DocFrontend.Models
{
    public class Notification
    {
        
        public int NotificationID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Acknowledged { get; set; }

    }

}
