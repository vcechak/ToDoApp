using AutoMapper;
using ToDoApi.Dtos;
using ToDoApi.Models;

namespace ToDoApi.Mappers;

public class TodoItemProfile : Profile
{
    public TodoItemProfile()
    {
        CreateMap<TodoItem, TodoItemResponse>();
        CreateMap<TodoItemCreateRequest, TodoItem>();

        // Maps update request to todo item, where the property is not null.
        CreateMap<TodoItemUpdateRequest, TodoItem>()
            .ForMember(dest => dest.UpdatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
