using AutoMapper;
using ToDoApi.Dtos;
using ToDoApi.Models;
using ToDoApi.Repositories.Abstraction;
using ToDoApi.Services.Abstraction;

namespace ToDoApi.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _repo;
    private readonly IMapper _mapper;

    public TodoService(ITodoRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    /// <summary>
    /// Creates a new todo item from the provided request.
    /// </summary>
    /// <param name="request">The todo item creation request.</param>
    /// <returns>The created todo item response, or null if creation failed.</returns>
    public async Task<TodoItemResponse?> CreateAsync(TodoItemCreateRequest request)
    {
        var todoItem = _mapper.Map<TodoItem>(request);
        var result = await _repo.AddAsync(todoItem);

        return result != null? _mapper.Map<TodoItemResponse>(todoItem) : null;
    }

    /// <summary>
    /// Deletes a todo item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item to delete.</param>
    /// <returns>True if the item was successfully deleted, false otherwise.</returns>
    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    /// <summary>
    /// Retrieves all todo items from the repository.
    /// </summary>
    /// <returns>A list of all todo items.</returns>
    public async Task<List<TodoItemResponse>> GetAllAsync()
    {
        var todoItems = await _repo.GetAllAsync();

        return _mapper.Map<List<TodoItemResponse>>(todoItems);
    }

    /// <summary>
    /// Gets a queryable collection of todo items for summary display, ordered by due date.
    /// Items without due dates are placed at the end.
    /// </summary>
    /// <returns>A queryable collection of todo item summaries.</returns>
    public IQueryable<TodoItemSummaryResponse> GetListSummary()
    {
        var todoItems = _repo.GetQueryable()
            .OrderBy(todoItem => todoItem.DueDate == null)
            .ThenBy(todoItem => todoItem.DueDate);

        return _mapper.ProjectTo<TodoItemSummaryResponse>(todoItems);
    }

    /// <summary>
    /// Retrieves a specific todo item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item.</param>
    /// <returns>The todo item response, or null if not found.</returns>
    public async Task<TodoItemResponse?> GetByIdAsync(int id)
    {
        return _mapper.Map<TodoItemResponse?>(await _repo.GetByIdAsync(id));
    }

    /// <summary>
    /// Updates an existing todo item with new data.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item to update.</param>
    /// <param name="request">The update request containing the new data.</param>
    /// <returns>The updated todo item response, or null if the item was not found or update failed.</returns>
    public async Task<TodoItemResponse?> UpdateAsync(int id, TodoItemUpdateRequest request)
    {
        var existingTodoItem = await _repo.GetByIdAsync(id);
        if (existingTodoItem == null)
        {
            return null;
        }

        var todoItem = _mapper.Map(request, existingTodoItem);
        var result = await _repo.UpdateAsync(todoItem);

        return result ? _mapper.Map<TodoItemResponse>(todoItem) : null;
    }
}
