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
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private SQLiteDBContext _sqlContext;

        public UserController(ILogger<UserController> logger, SQLiteDBContext sqlContext)
        {
            _logger = logger;
            _sqlContext = sqlContext;
        }

        [HttpGet]
        public IEnumerable<UserGrid> Get()
        {
            var users = from u in _sqlContext.Users
                        join r in _sqlContext.Roles on u.RoleID equals r.RoleID
                        select new UserGrid { 
                            UserID = u.UserID, 
                            UserName = u.UserName, 
                            Password = u.Password, 
                            Email = u.Email,
                            RoleName = r.RoleName 
                        };
            return users;
        }

        [HttpPost("login")]
        public ActionResult<UserGrid> Login(LoginUser user)
        {
            var loggedUser = (from u in _sqlContext.Users
                        join r in _sqlContext.Roles on u.RoleID equals r.RoleID
                        where (u.Email.Equals(user.Email) && u.Password.Equals(user.Password))
                        select new UserGrid { 
                            UserID = u.UserID, 
                            UserName = u.UserName, 
                            Password = u.Password, 
                            Email = u.Email,
                            RoleName = r.RoleName 
                        }).FirstOrDefault();
            if(loggedUser != null) {
                byte[] bUserID = Encoding.UTF8.GetBytes(loggedUser.UserID.ToString());
                HttpContext.Session.Set("userid", bUserID);

                byte[] bUserName = Encoding.UTF8.GetBytes(loggedUser.UserName.ToString());
                HttpContext.Session.Set("username", bUserName);

                byte[] bRole = Encoding.UTF8.GetBytes(loggedUser.RoleName.ToString());
                HttpContext.Session.Set("userrole", bRole);
            }
            return loggedUser;
        }

        [HttpPost("logout")]
        public ActionResult<string> Logout()
        {
            HttpContext.Session.Clear();

            return "Bye";
        }

        [HttpPost]
        public async Task<ActionResult<User>> Post(User user)
        {
            _sqlContext.Users.Add(user);
            await _sqlContext.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = user.UserID }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,
                                             User user)
        {
            if (id != user.UserID)
            {
                return BadRequest();
            }

            _sqlContext.Entry(user).State = EntityState.Modified;

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
        public async Task<ActionResult<User>> Delete(int id)
        {
            var user = await _sqlContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _sqlContext.Users.Remove(user);
            await _sqlContext.SaveChangesAsync();

            return user;
        }

        /*[HttpGet("userproject/{userid}")]
        public IEnumerable<UserGrid> Get(int userid)
        {

            var users = from u in _sqlContext.Users
                        join r in _sqlContext.Roles on u.RoleID equals r.RoleID
                        select new UserGrid { 
                            UserID = u.UserID, 
                            UserName = u.UserName, 
                            Password = u.Password, 
                            Email = u.Email,
                            RoleName = r.RoleName 
                        };
            return users;
        }*/
    }
}
