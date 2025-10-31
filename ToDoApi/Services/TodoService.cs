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

    public async Task<TodoItemResponse?> CreateAsync(TodoItemCreateRequest request)
    {
        var todoItem = _mapper.Map<TodoItem>(request);
        var result = await _repo.AddAsync(todoItem);

        return result != null? _mapper.Map<TodoItemResponse>(todoItem) : null;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    public async Task<List<TodoItemResponse>> GetAllAsync()
    {
        var todoItems = await _repo.GetAllAsync();

        return _mapper.Map<List<TodoItemResponse>>(todoItems);
    }

    public IQueryable<TodoItemSummaryResponse> GetListSummary()
    {
        var todoItems = _repo.GetQueryable()
            .OrderBy(todoItem => todoItem.DueDate == null)
            .ThenBy(todoItem => todoItem.DueDate);

        return _mapper.ProjectTo<TodoItemSummaryResponse>(todoItems);
    }

    public async Task<TodoItemResponse?> GetByIdAsync(int id)
    {
        return _mapper.Map<TodoItemResponse?>(await _repo.GetByIdAsync(id));
    }

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
