using Microsoft.EntityFrameworkCore;
using DocFrontend.Models;
using System;

namespace DocFrontend.SQLite
{
    internal interface ISQLiteDBContext : IDisposable
    {
        void OnConfiguring(DbContextOptionsBuilder options);
    }
    
    public class SQLiteDBContext : DbContext
    {
        public SQLiteDBContext(DbContextOptions<SQLiteDBContext> options) : base(options) 
        { 
        
        }
        public DbSet<UserProject> UserProjects { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<UserCustomer> UserCustomers { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Function> Functions { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=../data/doc-manager-db.db");
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserCustomer>().HasKey(ba => new { ba.CustomerID, ba.UserID });      
            modelBuilder.Entity<UserProject>().HasKey(ba => new { ba.ProjectID, ba.UserID });      
        }
    }
}