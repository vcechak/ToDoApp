using ToDoApi.Enums;

namespace ToDoApi.Dtos;

public sealed class TodoItemSummaryResponse
{
    public required int Id { get; set; }

    public required string Name { get; set; }

    public required DateTime DueDate { get; set; } 
    
    public required TodoState State {get; set;}
}
