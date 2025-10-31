using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using ToDoApi.Dtos;
using ToDoApi.Services;
using ToDoApi.Services.Abstraction;

namespace ToDoApi.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly IODataService _odataService;

    public TodoController(ITodoService todoService, IODataService odataService)
    {
        _todoService = todoService;
        _odataService = odataService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoItemResponse>>> GetAll()
    {
        return Ok(await _todoService.GetAllAsync());
    }

    [HttpGet("summary")]
    public IActionResult GetListSummary(ODataQueryOptions<TodoItemSummaryResponse> queryOptions)
    {
        var queryable = _todoService.GetListSummary();
        return _odataService.ProcessQuery(queryable, queryOptions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemResponse>> GetById(int id)
    {
        var item = await _todoService.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItemCreateRequest>> Create(TodoItemCreateRequest request)
    {
        var createdItem = await _todoService.CreateAsync(request);
        if (createdItem == null)
        {
            return BadRequest("Could not create the todo item.");
        }

        return CreatedAtAction(nameof(Create), new { id = createdItem.Id }, createdItem);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItemUpdateRequest>> Update(int id, TodoItemUpdateRequest request)
    {
        var updatedItem = await _todoService.UpdateAsync(id, request);
        if (updatedItem == null)
        {
            return NotFound();
        }
        return Ok(updatedItem);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _todoService.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
