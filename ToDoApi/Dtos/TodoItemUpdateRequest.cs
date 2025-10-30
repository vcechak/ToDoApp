using System.ComponentModel.DataAnnotations;
using ToDoApi.Enums;

namespace ToDoApi.Dtos;

public sealed class TodoItemUpdateRequest
{
    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public TodoState? State { get; set; }
}
