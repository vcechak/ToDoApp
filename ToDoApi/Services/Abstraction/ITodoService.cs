using ToDoApi.Dtos;

namespace ToDoApi.Services.Abstraction;

public interface ITodoService
{
    Task<List<TodoItemResponse>> GetAllAsync();
    Task<List<TodoItemSummaryResponse>> GetAllSummaryAsync();
    Task<TodoItemResponse?> GetByIdAsync(int id);
    Task<TodoItemResponse?> CreateAsync(TodoItemCreateRequest request);
    Task<TodoItemResponse?> UpdateAsync(int id, TodoItemUpdateRequest request);
    Task<bool> DeleteAsync(int id);
}
