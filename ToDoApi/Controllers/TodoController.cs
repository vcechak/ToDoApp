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

    /// <summary>
    /// Retrieves all todo items.
    /// </summary>
    /// <returns>A list of all todo items.</returns>
    /// <response code="200">Returns the list of todo items.</response>
    [HttpGet]
    public async Task<ActionResult<List<TodoItemResponse>>> GetAll()
    {
        return Ok(await _todoService.GetAllAsync());
    }

    /// <summary>
    /// Retrieves a summary of todo items with OData query support.
    /// </summary>
    /// <param name="queryOptions">OData query options for filtering, sorting, and paging.</param>
    /// <returns>A filtered and paginated summary of todo items.</returns>
    /// <response code="200">Returns the filtered summary of todo items.</response>
    [HttpGet("summary")]
    public IActionResult GetListSummary(ODataQueryOptions<TodoItemSummaryResponse> queryOptions)
    {
        var queryable = _todoService.GetListSummary();
        return _odataService.ProcessQuery(queryable, queryOptions);
    }

    /// <summary>
    /// Retrieves a specific todo item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item.</param>
    /// <returns>The todo item with the specified ID.</returns>
    /// <response code="200">Returns the todo item.</response>
    /// <response code="404">If the todo item is not found.</response>
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

    /// <summary>
    /// Creates a new todo item.
    /// </summary>
    /// <param name="request">The todo item creation request containing the details.</param>
    /// <returns>The created todo item.</returns>
    /// <response code="201">Returns the newly created todo item.</response>
    /// <response code="400">If the todo item could not be created.</response>
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

    /// <summary>
    /// Updates an existing todo item.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item to update.</param>
    /// <param name="request">The todo item update request containing the new details.</param>
    /// <returns>The updated todo item.</returns>
    /// <response code="200">Returns the updated todo item.</response>
    /// <response code="404">If the todo item is not found.</response>
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

    /// <summary>
    /// Deletes a todo item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the todo item to delete.</param>
    /// <returns>No content if successful.</returns>
    /// <response code="204">If the todo item was successfully deleted.</response>
    /// <response code="404">If the todo item is not found.</response>
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
