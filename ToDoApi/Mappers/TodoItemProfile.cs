using AutoMapper;
using ToDoApi.Dtos;
using ToDoApi.Models;

namespace ToDoApi.Mappers;

public class TodoItemProfile : Profile
{
    public TodoItemProfile()
    {
        // From Todo Item
        CreateMap<TodoItem, TodoItemResponse>();
        CreateMap<TodoItem, TodoItemSummaryResponse>();

        // To Todo Item
        CreateMap<TodoItemCreateRequest, TodoItem>();
        CreateMap<TodoItemUpdateRequest, TodoItem>()
            .ForMember(dest => dest.UpdatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
