using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DocFrontend.Models;
using DocFrontend.SQLite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data;

namespace DocFrontend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly ILogger<DocumentController> _logger;
        private SQLiteDBContext _sqlContext;

        public DocumentController(ILogger<DocumentController> logger, SQLiteDBContext sqlContext)
        {
            _logger = logger;
            _sqlContext = sqlContext;
        }

        [HttpGet]
        public IEnumerable<DocumentGrid> Get()
        {
            var doc = from d in _sqlContext.Documents
                        join p in _sqlContext.Projects on d.ProjectID equals p.ProjectID
                        select new DocumentGrid {
                            DocumentID = d.DocumentID,
                            Title = d.Title,
                            FileName = d.FileName,
                            ProjectName = p.Name
                        };
            return doc;
        }

        [HttpGet("{projectid}")]
        public IEnumerable<DocumentGrid> Get(int projectid)
        {
            var doc = from d in _sqlContext.Documents
                        join p in _sqlContext.Projects on d.ProjectID equals p.ProjectID
                        where d.ProjectID.Equals(projectid)
                        select new DocumentGrid {
                            DocumentID = d.DocumentID,
                            Title = d.Title,
                            FileName = d.FileName,
                            Approved = d.Approved,
                            ProjectName = p.Name
                        };
            return doc;
        }

        [HttpPost("{projid}")]
        public async Task<ActionResult<bool>> Post([FromForm] FileInputModel file, int projid)
        {
            try {
                var filePath = Path.Combine("./wwwroot/uploads/", Path.GetRandomFileName()) + ".pdf";

                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.document.CopyToAsync(stream);
                }

                Document d = new Document();
                int intIdt = (_sqlContext.Documents.Count<Document>() > 0 ? (_sqlContext.Documents.Max(p => p.DocumentID) + 1) : 1);
                d.DocumentID = intIdt;
                d.Title = file.title;
                d.Approved = 0;
                d.FileName = filePath.Replace("./wwwroot", "");;
                d.ProjectID = projid;

                _sqlContext.Documents.Add(d);
                await _sqlContext.SaveChangesAsync();

                var json_string = "{ success: 'true' }";
                return Content(json_string, "application/json");
            }
            catch (Exception) {
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,
                                             Document document)
        {
            if (id != document.DocumentID)
            {
                return BadRequest();
            }

            _sqlContext.Entry(document).State = EntityState.Modified;

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
        public async Task<ActionResult<Document>> Delete(int id)
        {
            var doc = await _sqlContext.Documents.FindAsync(id);
            if (doc == null)
            {
                return NotFound();
            }

            var fileInfo = new System.IO.FileInfo("./wwwroot/" + doc.FileName);
            if (fileInfo.Exists)
                fileInfo.Delete();

            _sqlContext.Documents.Remove(doc);
            await _sqlContext.SaveChangesAsync();

            return doc;
        }

        [HttpPost("notification")]
        public async Task<ActionResult<Notification>> PostNotification(Notification note)
        {
            if(note.NotificationID == -1) {
                int intIdt = (_sqlContext.Notifications.Count<Notification>() > 0 ? (_sqlContext.Notifications.Max(p => p.NotificationID) + 1) : 1);
                note.NotificationID = intIdt;
            }

            _sqlContext.Notifications.Add(note);
            await _sqlContext.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = note.NotificationID }, note);
        }

        [HttpGet("notification")]
        public IEnumerable<Notification> GetNotification()
        {
            var not = from n in _sqlContext.Notifications
                        where n.Acknowledged.Equals(0)
                        select n;
            return not;
        }

        [HttpGet("notifcount")]
        public ActionResult<int> GetNotificationCount() => _sqlContext.Notifications.Where(n => n.Acknowledged.Equals(0)).Count<Notification>();

        [HttpPut("notification/{notifIds}")]
        public async Task<IActionResult> Put(string notifIds)
        {
            List<string> lNotidIds = notifIds.Split(',').ToList();
            List<int> notIds = new List<int>();
            foreach (string s in lNotidIds) {
                notIds.Add(Convert.ToInt32(s));
            }
            var not = _sqlContext.Notifications
                        .Where(t => notIds.Contains(t.NotificationID));

            if(not == null) {
                return NotFound();
            }

            foreach (Notification n in not.ToList()) {
                n.Acknowledged = 1;
                _sqlContext.Entry(n).State = EntityState.Modified;
            }

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
    }
}
