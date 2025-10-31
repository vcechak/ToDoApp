using AutoMapper;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using ToDoApi.Context;
using ToDoApi.Dtos;
using ToDoApi.Mappers;
using ToDoApi.Repositories;
using ToDoApi.Repositories.Abstraction;
using ToDoApi.Services;
using ToDoApi.Services.Abstraction;

namespace ToDoApi.Extensions;

public static class ServicesRegistrationExtension
{
    public static IServiceCollection AddAppDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<TodoAppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        return services;
    }

    public static IServiceCollection AddAppCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });
        return services;
    }

    public static IServiceCollection AddAppAutoMapper(this IServiceCollection services)
    {
        services.AddSingleton<IMapper>(sp =>
        {
            var loggerFactory = sp.GetRequiredService<ILoggerFactory>();
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<TodoItemProfile>();
            }, loggerFactory);

            return config.CreateMapper();
        });
        return services;
    }

    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
        services.AddScoped<ITodoRepository, TodoRepository>();
        services.AddScoped<ITodoService, TodoService>();
        services.AddScoped<IODataService, ODataService>();
        return services;
    }

    public static IServiceCollection AddODataServices(this IServiceCollection services)
    {
        services.AddControllers()
            .AddOData(options => options
                .Select()
                .Filter()
                .OrderBy()
                .Expand()
                .Count()
                .SetMaxTop(100));
        
        return services;
    }
}