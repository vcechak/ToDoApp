using ToDoApi.Enums;

namespace ToDoApi.Dtos;

public sealed class TodoItemCreateRequest
{
    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public TodoState State { get; set; } = TodoState.New;
}
