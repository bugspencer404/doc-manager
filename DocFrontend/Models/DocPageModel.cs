using System.Text;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DocFrontend.ModelOverride
{
    public class DocPageModel : PageModel
    {
        public string userid = null;
        public string username = null;
        public string userrole = null;

        public void OnGet()
        {
            byte [] test;
            HttpContext.Session.TryGetValue("userid", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                userid = converted;
            }
            else {
                if(!HttpContext.Request.Path.Value.Equals("/"))
                    Response.Redirect("./");
            }

            HttpContext.Session.TryGetValue("username", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                username = converted;
            }

            HttpContext.Session.TryGetValue("userrole", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                userrole = converted;
            }
        }
    }
}