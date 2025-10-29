using Microsoft.EntityFrameworkCore;
using ToDoApi.Models;

namespace ToDoApi.Context;

public sealed class TodoAppDbContext(DbContextOptions<TodoAppDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> TodoItems { get; set; }
}