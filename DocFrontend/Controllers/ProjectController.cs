using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DocFrontend.Models;
using DocFrontend.SQLite;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace DocFrontend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ILogger<ProjectController> _logger;
        private SQLiteDBContext _sqlContext;

        public ProjectController(ILogger<ProjectController> logger, SQLiteDBContext sqlContext)
        {
            _logger = logger;
            _sqlContext = sqlContext;
        }

        private List<String> getSessionValues () {
            List<String> sessionValues = new List<string>();
            byte [] test;
            HttpContext.Session.TryGetValue("userid", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                sessionValues.Add(converted);
            }
            else {
                if(!HttpContext.Request.Path.Value.Equals("/"))
                    Response.Redirect("./");
            }

            HttpContext.Session.TryGetValue("username", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                sessionValues.Add(converted);
            }

            HttpContext.Session.TryGetValue("userrole", out test);
            if (test != null) {
                string converted = Encoding.UTF8.GetString(test, 0, test.Length);
                sessionValues.Add(converted);
            }
            return sessionValues;
        }

        [HttpGet]
        public IEnumerable<ProjectGrid> Get()
        {
            var proj = from p in _sqlContext.Projects
                        join c in _sqlContext.Customers on p.CustomerID equals c.CustomerID
                        select new ProjectGrid {
                            ProjectID = p.ProjectID,
                            Name = p.Name,
                            Description = p.Description,
                            CustomerName = c.CustomerName
                        };
            return proj;
        }

        [HttpGet("{customerid}")]
        public IEnumerable<ProjectGrid> Get(int customerid)
        {
            List<string> list = getSessionValues();
            var UserRoles = list[2];
            var UserID = Convert.ToInt32(list[0]);

            if(UserRoles.Equals("Administrator")) {
                var proj = from p in _sqlContext.Projects
                            join c in _sqlContext.Customers on p.CustomerID equals c.CustomerID
                            where p.CustomerID.Equals(customerid)
                            select new ProjectGrid {
                                ProjectID = p.ProjectID,
                                Name = p.Name,
                                Description = p.Description,
                                CustomerName = c.CustomerName
                            };
                return proj;
            }
            else {
                var proj = from p in _sqlContext.Projects
                            join c in _sqlContext.Customers on p.CustomerID equals c.CustomerID
                            join up in _sqlContext.UserProjects on p.ProjectID equals up.ProjectID
                            where (p.CustomerID.Equals(customerid) && up.UserID.Equals(UserID))
                            select new ProjectGrid {
                                ProjectID = p.ProjectID,
                                Name = p.Name,
                                Description = p.Description,
                                CustomerName = c.CustomerName
                            };
                return proj;
            }
        }

        [HttpPost]
        public async Task<ActionResult<Project>> Post(Project project)
        {
            if(project.ProjectID == -1) {
                int intIdt = (_sqlContext.Documents.Count<Document>() > 0 ? (_sqlContext.Documents.Max(p => p.DocumentID) + 1) : 1);
                project.ProjectID = intIdt;
            }

            _sqlContext.Projects.Add(project);
            await _sqlContext.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = project.ProjectID }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,
                                             Project project)
        {
            if (id != project.ProjectID)
            {
                return BadRequest();
            }

            _sqlContext.Entry(project).State = EntityState.Modified;

            try
            {
                await _sqlContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Project>> Delete(int id)
        {
            var project = await _sqlContext.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _sqlContext.Projects.Remove(project);
            await _sqlContext.SaveChangesAsync();

            return project;
        }

        [HttpGet("tags")]
        public IEnumerable<ProjectTag> GetTags()
        {
            var proj = from p in _sqlContext.Projects
                        join c in _sqlContext.Customers on p.CustomerID equals c.CustomerID
                        select new ProjectTag {
                            id = p.ProjectID,
                            description = c.CustomerName + " - " + p.Name
                        };
            return proj;
        }

        [HttpGet("tags/{userid}")]
        public IEnumerable<int> GetTags(int userid)
        {
            var proj = from p in _sqlContext.Projects
                        join up in _sqlContext.UserProjects on p.ProjectID equals up.ProjectID
                        where up.UserID.Equals(userid)
                        select p.ProjectID;
            return proj;
        }

        [HttpPost("tags/{userid}/{projectids}")]
        public async Task<ActionResult<bool>> PostTags(int userid, string projectids)
        {
            var uprojects = _sqlContext.UserProjects.Where(up => up.UserID.Equals(userid));
            if (uprojects == null)
            {
                return NotFound();
            }

            foreach(UserProject up in uprojects)
                _sqlContext.UserProjects.Remove(up);
            
            await _sqlContext.SaveChangesAsync();

            if (projectids.Equals("nothing")) {
                return true;
            }
            string [] stemp = projectids.Split(',');
            List<string> listProjs = stemp.ToList();

            foreach(string s in listProjs)
                _sqlContext.UserProjects.Add(new UserProject () {
                    UserID = userid,
                    ProjectID = Convert.ToInt32(s)
                });
            
            await _sqlContext.SaveChangesAsync();

            return true;
        }
    }
}
