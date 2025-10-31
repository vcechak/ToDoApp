using Microsoft.EntityFrameworkCore;
using ToDoApi.Context;
using ToDoApi.Models;
using ToDoApi.Repositories.Abstraction;

namespace ToDoApi.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoAppDbContext _dbContext;
    public TodoRepository(TodoAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TodoItem?> AddAsync(TodoItem item)
    {
        await _dbContext.TodoItems.AddAsync(item);
        var result = await _dbContext.SaveChangesAsync();
        return result > 0? item : null;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var todoItem = await _dbContext.TodoItems.FindAsync(id);
        
        if (todoItem != null)
        {
            _dbContext.TodoItems.Remove(todoItem);
            var result = await _dbContext.SaveChangesAsync();
            return result > 0;
        }

        return false;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return await _dbContext.TodoItems
            .OrderBy(todoItem => todoItem.DueDate == null)
            .ThenBy(todoItem => todoItem.DueDate)
            .ToListAsync();
    }

    public IQueryable<TodoItem> GetQueryable()
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return _dbContext.TodoItems.AsQueryable();
    }

    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return await _dbContext.TodoItems.FindAsync(id);
    }

    public async Task<bool> UpdateAsync(TodoItem item)
    {
        _dbContext.TodoItems.Update(item);
        var result = await _dbContext.SaveChangesAsync();
        return result > 0;
    }
}
