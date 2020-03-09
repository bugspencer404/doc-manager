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
    public class CustomerController : ControllerBase
    {
        private readonly ILogger<CustomerController> _logger;
        private SQLiteDBContext _sqlContext;

        public CustomerController(ILogger<CustomerController> logger, SQLiteDBContext sqlContext)
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
        public IEnumerable<Customer> Get()
        {
            List<string> list = getSessionValues();
            var UserRoles = list[2];
            var UserID = Convert.ToInt32(list[0]);

            if(UserRoles.Equals("Administrator")) {
                var custms = from c in _sqlContext.Customers
                            select c;
                return custms;
            }
            else {
                var custms = (from c in _sqlContext.Customers
                        join p in _sqlContext.Projects on c.CustomerID equals p.CustomerID
                        join up in _sqlContext.UserProjects on p.ProjectID equals up.ProjectID
                        where up.UserID.Equals(UserID)
                        select c).Distinct();
                return custms;
            }
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Post(Customer customer)
        {
            if(customer.CustomerID == -1) {
                int intIdt = (_sqlContext.Customers.Count<Customer>() > 0 ? (_sqlContext.Customers.Max(p => p.CustomerID) + 1) : 1);
                customer.CustomerID = intIdt;
            }

            _sqlContext.Customers.Add(customer);
            await _sqlContext.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = customer.CustomerID }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id,
                                             Customer customer)
        {
            if (id != customer.CustomerID)
            {
                return BadRequest();
            }

            _sqlContext.Entry(customer).State = EntityState.Modified;

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
        public async Task<ActionResult<Customer>> Delete(int id)
        {
            var customer = await _sqlContext.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _sqlContext.Customers.Remove(customer);
            await _sqlContext.SaveChangesAsync();

            return customer;
        }
    }
}
