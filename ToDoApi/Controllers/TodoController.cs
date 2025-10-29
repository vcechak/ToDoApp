using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ToDoApi.Context;
using ToDoApi.Dtos;
using ToDoApi.Services.Abstraction;

namespace ToDoApi.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _service;

    public TodoController(ITodoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoItemResponse>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItemResponse>> GetById(int id)
    {
        var item = await _service.GetByIdAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItemCreateRequest>> Create(TodoItemCreateRequest request)
    {
        var createdItem = await _service.CreateAsync(request);
        if (createdItem == null)
        {
            return BadRequest("Could not create the todo item.");
        }

        return CreatedAtAction(nameof(Create), new { id = createdItem.Id }, createdItem);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoItemUpdateRequest>> Update(int id, TodoItemUpdateRequest request)
    {
        var updatedItem = await _service.UpdateAsync(id, request);
        if (updatedItem == null)
        {
            return NotFound();
        }
        return Ok(updatedItem);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
