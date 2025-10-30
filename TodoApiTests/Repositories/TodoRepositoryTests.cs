using Xunit;
using Microsoft.EntityFrameworkCore;
using ToDoApi.Context;
using ToDoApi.Repositories;
using ToDoApi.Models;
using ToDoApi.Enums;

namespace TodoApiTests.Repositories;

public class TodoRepositoryTests : IDisposable
{
    private readonly TodoAppDbContext _context;
    private readonly TodoRepository _repository;

    public TodoRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<TodoAppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new TodoAppDbContext(options);
        _repository = new TodoRepository(_context);
    }

    [Fact]
    public async Task AddAsync_ReturnsAddedItem_WhenSuccessful()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0, 
            Name = "Test Task",
            Description = "Test Description",
            State = TodoState.New,
            DueDate = DateTime.Now.AddDays(7)
        };

        // Act
        var result = await _repository.AddAsync(todoItem);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.Id > 0);
        Assert.Equal("Test Task", result.Name);
        Assert.Equal("Test Description", result.Description);
        Assert.Equal(TodoState.New, result.State);

        var savedItem = await _context.TodoItems.FindAsync(result.Id);
        Assert.NotNull(savedItem);
        Assert.Equal("Test Task", savedItem.Name);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsOrderedItems_DueDateNullsLast()
    {
        // Arrange
        var items = new[]
        {
            new TodoItem { Id = 0, Name = "Task 1", State = TodoState.New, DueDate = DateTime.Now.AddDays(3) },
            new TodoItem { Id = 0, Name = "Task 2", State = TodoState.New, DueDate = null },
            new TodoItem { Id = 0, Name = "Task 3", State = TodoState.New, DueDate = DateTime.Now.AddDays(1) },
            new TodoItem { Id = 0, Name = "Task 4", State = TodoState.New, DueDate = null },
            new TodoItem { Id = 0, Name = "Task 5", State = TodoState.New, DueDate = DateTime.Now.AddDays(2) }
        };
        _context.TodoItems.AddRange(items);
        await _context.SaveChangesAsync();

        // Act
        var result = (await _repository.GetAllAsync()).ToList();

        // Assert
        Assert.Equal(5, result.Count);
        
        // Items with due dates should come first, ordered by due date
        Assert.Equal("Task 3", result[0].Name); // Due in 1 day
        Assert.Equal("Task 5", result[1].Name); // Due in 2 days  
        Assert.Equal("Task 1", result[2].Name); // Due in 3 days
        
        // Items with null due dates should come last
        Assert.Null(result[3].DueDate);
        Assert.Null(result[4].DueDate);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsEmptyList_WhenNoItems()
    {
        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsItem_WhenExists()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Test Task",
            State = TodoState.New
        };
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByIdAsync(todoItem.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Task", result.Name);
        Assert.Equal(todoItem.Id, result.Id);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotExists()
    {
        // Arrange
        var nonExistentId = 999;

        // Act
        var result = await _repository.GetByIdAsync(nonExistentId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsTrue_WhenSuccessful()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Original Task",
            Description = "Original Description",
            State = TodoState.New
        };
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        todoItem.Name = "Updated Task";
        todoItem.Description = "Updated Description";
        todoItem.State = TodoState.InProgress;

        // Act
        var result = await _repository.UpdateAsync(todoItem);

        // Assert
        Assert.True(result);

        // Verify the update was saved
        var updatedItem = await _context.TodoItems.FindAsync(todoItem.Id);
        Assert.NotNull(updatedItem);
        Assert.Equal("Updated Task", updatedItem.Name);
        Assert.Equal("Updated Description", updatedItem.Description);
        Assert.Equal(TodoState.InProgress, updatedItem.State);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenItemExists()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Task to Delete",
            State = TodoState.New
        };
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();
        var itemId = todoItem.Id;

        // Act
        var result = await _repository.DeleteAsync(itemId);

        // Assert
        Assert.True(result);

        // Verify the item was actually deleted
        var deletedItem = await _context.TodoItems.FindAsync(itemId);
        Assert.Null(deletedItem);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenItemNotExists()
    {
        // Arrange
        var nonExistentId = 999;

        // Act
        var result = await _repository.DeleteAsync(nonExistentId);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetAllAsync_UsesNoTracking()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Test Task",
            State = TodoState.New
        };
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        // Act
        var items = (await _repository.GetAllAsync()).ToList();
        var retrievedItem = items.First();

        retrievedItem.Name = "Modified Name";

        await _context.SaveChangesAsync();

        // Assert
        // Verify the original item in database is unchanged
        var originalItem = await _context.TodoItems.FindAsync(todoItem.Id);
        Assert.Equal("Test Task", originalItem!.Name); // Should still be original name
    }

    [Fact]
    public async Task GetByIdAsync_FindAsyncIgnoresNoTrackingSetting()
    {
        // Arrange
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Test Task",
            State = TodoState.New
        };
        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        // Act
        var retrievedItem = await _repository.GetByIdAsync(todoItem.Id);
        Assert.NotNull(retrievedItem);

        retrievedItem.Name = "Modified Name";

        await _context.SaveChangesAsync();

        // Assert
        var changedItem = await _context.TodoItems.FindAsync(todoItem.Id);
        Assert.Equal("Modified Name", changedItem!.Name); // The name was actually changed
    }

    [Fact]
    public async Task AddAsync_SetsCreatedOnTimestamp()
    {
        // Arrange
        var beforeAdd = DateTime.UtcNow;
        var todoItem = new TodoItem
        {
            Id = 0,
            Name = "Test Task",
            State = TodoState.New
        };

        // Act
        var result = await _repository.AddAsync(todoItem);
        var afterAdd = DateTime.UtcNow;

        // Assert
        Assert.NotNull(result);
        Assert.True(result.CreatedOn >= beforeAdd && result.CreatedOn <= afterAdd);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}