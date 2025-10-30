using System.ComponentModel.DataAnnotations;
using ToDoApi.Enums;

namespace ToDoApi.Models;

public sealed class TodoItem : ModelBase
{
    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public TodoState State { get; set; }
}
