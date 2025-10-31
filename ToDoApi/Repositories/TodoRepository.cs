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

    /// <summary>
    /// Adds a new todo item to the database.
    /// </summary>
    /// <param name="item">The todo item to add.</param>
    /// <returns>The added todo item if successful, null otherwise.</returns>
    public async Task<TodoItem?> AddAsync(TodoItem item)
    {
        await _dbContext.TodoItems.AddAsync(item);
        var result = await _dbContext.SaveChangesAsync();
        return result > 0? item : null;
    }

    /// <summary>
    /// Deletes a todo item from the database by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item to delete.</param>
    /// <returns>True if the item was successfully deleted, false otherwise.</returns>
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

    /// <summary>
    /// Retrieves all todo items from the database, ordered by due date.
    /// Items without due dates are placed at the end. Uses no-tracking for read-only operations.
    /// </summary>
    /// <returns>A collection of all todo items.</returns>
    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return await _dbContext.TodoItems
            .OrderBy(todoItem => todoItem.DueDate == null)
            .ThenBy(todoItem => todoItem.DueDate)
            .ToListAsync();
    }

    /// <summary>
    /// Gets a queryable collection of todo items for advanced querying scenarios.
    /// Uses no-tracking for read-only operations.
    /// </summary>
    /// <returns>A queryable collection of todo items.</returns>
    public IQueryable<TodoItem> GetQueryable()
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return _dbContext.TodoItems.AsQueryable();
    }

    /// <summary>
    /// Retrieves a specific todo item by its ID.
    /// Uses no-tracking for read-only operations.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item.</param>
    /// <returns>The todo item if found, null otherwise.</returns>
    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        return await _dbContext.TodoItems.FindAsync(id);
    }

    /// <summary>
    /// Updates an existing todo item in the database.
    /// </summary>
    /// <param name="item">The todo item with updated values.</param>
    /// <returns>True if the update was successful, false otherwise.</returns>
    public async Task<bool> UpdateAsync(TodoItem item)
    {
        _dbContext.TodoItems.Update(item);
        var result = await _dbContext.SaveChangesAsync();
        return result > 0;
    }
}
