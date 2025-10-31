using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using ToDoApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Service registrations via extension methods
builder.Services
    .AddAppDbContext(builder.Configuration)
    .AddAppCors()
    .AddAppAutoMapper()
    .AddAppServices();

// Add OData support for query options (filtering, sorting, paging)
builder.Services.AddControllers()
    .AddOData(opt => opt
        .Select()
        .Filter()
        .OrderBy()
        .Expand()
        .SetMaxTop(100)
        .Count()
        .SkipToken());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ToDoApi.Context.TodoAppDbContext>();
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