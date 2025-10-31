using ToDoApi.Models;

namespace ToDoApi.Repositories.Abstraction;

public interface ITodoRepository
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    IQueryable<TodoItem> GetQueryable();
    Task<TodoItem?> GetByIdAsync(int id);
    Task<TodoItem?> AddAsync(TodoItem item);
    Task<bool> UpdateAsync(TodoItem item);
    Task<bool> DeleteAsync(int id);
}
