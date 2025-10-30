using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ToDoApi.Context;
using ToDoApi.Mappers;
using ToDoApi.Repositories;
using ToDoApi.Repositories.Abstraction;
using ToDoApi.Services;
using ToDoApi.Services.Abstraction;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<TodoAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSingleton<IMapper>(sp =>
{
    var loggerFactory = sp.GetRequiredService<ILoggerFactory>();
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<TodoItemProfile>();
    }, loggerFactory);

    return config.CreateMapper();
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Scoped Services
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using ( var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<TodoAppDbContext>();
        dbContext.Database.Migrate();
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
