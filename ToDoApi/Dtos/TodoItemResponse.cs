using ToDoApi.Enums;

namespace ToDoApi.Dtos;

public sealed class TodoItemResponse
{
    public required int Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    public required TodoState State { get; set; }

    public DateTime CreatedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }
}
