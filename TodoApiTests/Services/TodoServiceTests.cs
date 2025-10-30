using Xunit;
using Moq;
using AutoMapper;
using ToDoApi.Services;
using ToDoApi.Repositories.Abstraction;
using ToDoApi.Models;
using ToDoApi.Dtos;
using ToDoApi.Enums;

namespace TodoApiTests.Services;

public class TodoServiceTests
{
    private readonly Mock<ITodoRepository> _repoMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TodoService _service;

    public TodoServiceTests()
    {
        _repoMock = new Mock<ITodoRepository>();
        _mapperMock = new Mock<IMapper>();
        _service = new TodoService(_repoMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ReturnsResponse_WhenItemCreated()
    {
        // Arrange
        var createRequest = new TodoItemCreateRequest { Name = "Test", State = TodoState.New };
        var todoItem = new TodoItem { Id = 0, Name = "Test", State = TodoState.New };
        var savedTodoItem = new TodoItem { Id = 1, Name = "Test", State = TodoState.New };
        var response = new TodoItemResponse { Id = 1, Name = "Test", State = TodoState.New };

        _mapperMock.Setup(m => m.Map<TodoItem>(createRequest)).Returns(todoItem);
        _repoMock.Setup(r => r.AddAsync(todoItem)).ReturnsAsync(savedTodoItem);
        _mapperMock.Setup(m => m.Map<TodoItemResponse>(todoItem)).Returns(response);

        // Act
        var result = await _service.CreateAsync(createRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test", result.Name);
        Assert.Equal(TodoState.New, result.State);
        _repoMock.Verify(r => r.AddAsync(todoItem), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ReturnsNull_WhenRepositoryReturnsNull()
    {
        // Arrange
        var createRequest = new TodoItemCreateRequest { Name = "Test", State = TodoState.New };
        var todoItem = new TodoItem { Id = 0, Name = "Test", State = TodoState.New };

        _mapperMock.Setup(m => m.Map<TodoItem>(createRequest)).Returns(todoItem);
        _repoMock.Setup(r => r.AddAsync(todoItem)).ReturnsAsync((TodoItem?)null);

        // Act
        var result = await _service.CreateAsync(createRequest);

        // Assert
        Assert.Null(result);
        _mapperMock.Verify(m => m.Map<TodoItemResponse>(It.IsAny<TodoItem>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenItemDeleted()
    {
        // Arrange
        var itemId = 1;
        _repoMock.Setup(r => r.DeleteAsync(itemId)).ReturnsAsync(true);

        // Act
        var result = await _service.DeleteAsync(itemId);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenItemNotFound()
    {
        // Arrange
        var itemId = 1;
        _repoMock.Setup(r => r.DeleteAsync(itemId)).ReturnsAsync(false);

        // Act
        var result = await _service.DeleteAsync(itemId);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsResponses()
    {
        // Arrange
        var todoItems = new List<TodoItem>
        {
            new TodoItem {Id = 1,  Name = "Task A", State = TodoState.New },
            new TodoItem {Id = 2,  Name = "Task B", State = TodoState.InProgress }
        };
        var responses = new List<TodoItemResponse>
        {
            new TodoItemResponse { Id = 1, Name = "Task A", State = TodoState.New },
            new TodoItemResponse { Id = 2, Name = "Task B", State = TodoState.InProgress }
        };

        _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(todoItems);
        _mapperMock.Setup(m => m.Map<List<TodoItemResponse>>(todoItems)).Returns(responses);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Task A", result[0].Name);
        Assert.Equal("Task B", result[1].Name);
        Assert.Equal(TodoState.New, result[0].State);
        Assert.Equal(TodoState.InProgress, result[1].State);
    }

    [Fact]
    public async Task GetAllSummaryAsync_ReturnsSummaryResponses()
    {
        // Arrange
        var todoItems = new List<TodoItem>
        {
            new TodoItem {Id = 1,  Name = "Task A", State = TodoState.New }
        };
        var summaryResponses = new List<TodoItemSummaryResponse>
        {
            new TodoItemSummaryResponse { Id = 1, Name = "Task A", State = TodoState.New }
        };

        _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(todoItems);
        _mapperMock.Setup(m => m.Map<List<TodoItemSummaryResponse>>(todoItems)).Returns(summaryResponses);

        // Act
        var result = await _service.GetAllSummaryAsync();

        // Assert
        Assert.Single(result);
        Assert.Equal("Task A", result[0].Name);
        Assert.Equal(TodoState.New, result[0].State);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsResponse_WhenFound()
    {
        // Arrange
        var itemId = 1;
        var todoItem = new TodoItem {Id = itemId, Name = "Test", State = TodoState.New };
        var response = new TodoItemResponse { Id = itemId, Name = "Test", State = TodoState.New };

        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync(todoItem);
        _mapperMock.Setup(m => m.Map<TodoItemResponse?>(todoItem)).Returns(response);

        // Act
        var result = await _service.GetByIdAsync(itemId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test", result.Name);
        Assert.Equal(TodoState.New, result.State);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        // Arrange
        var itemId = 1;
        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync((TodoItem?)null);
        _mapperMock.Setup(m => m.Map<TodoItemResponse?>(It.IsAny<TodoItem>())).Returns((TodoItemResponse?)null);

        // Act
        var result = await _service.GetByIdAsync(itemId);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsResponse_WhenUpdated()
    {
        // Arrange
        var itemId = 1;
        var updateRequest = new TodoItemUpdateRequest { Description = "Updated" };
        var existingItem = new TodoItem {Id = itemId, Name = "Test", State = TodoState.New };
        var updatedItem = new TodoItem {Id = itemId, Name = "Test", State = TodoState.New, Description = "Updated" };
        var response = new TodoItemResponse { Id = itemId, Name = "Test", State = TodoState.New, Description = "Updated" };

        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync(existingItem);
        _mapperMock.Setup(m => m.Map(updateRequest, existingItem)).Returns(updatedItem);
        _repoMock.Setup(r => r.UpdateAsync(updatedItem)).ReturnsAsync(true);
        _mapperMock.Setup(m => m.Map<TodoItemResponse>(updatedItem)).Returns(response);

        // Act
        var result = await _service.UpdateAsync(itemId, updateRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Updated", result.Description);
        _repoMock.Verify(r => r.GetByIdAsync(itemId), Times.Once);
        _repoMock.Verify(r => r.UpdateAsync(updatedItem), Times.Once);
        _mapperMock.Verify(m => m.Map(updateRequest, existingItem), Times.Once);
        _mapperMock.Verify(m => m.Map<TodoItemResponse>(updatedItem), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenUpdateFails()
    {
        // Arrange
        var itemId = 1;
        var updateRequest = new TodoItemUpdateRequest { Description = "Updated" };
        var existingItem = new TodoItem {Id = itemId, Name = "Test", State = TodoState.New };
        var updatedItem = new TodoItem {Id = itemId, Name = "Test", State = TodoState.New, Description = "Updated" };

        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync(existingItem);
        _mapperMock.Setup(m => m.Map(updateRequest, existingItem)).Returns(updatedItem);
        _repoMock.Setup(r => r.UpdateAsync(updatedItem)).ReturnsAsync(false);

        // Act
        var result = await _service.UpdateAsync(itemId, updateRequest);

        // Assert
        Assert.Null(result);
        _repoMock.Verify(r => r.UpdateAsync(updatedItem), Times.Once);
        _mapperMock.Verify(m => m.Map<TodoItemResponse>(It.IsAny<TodoItem>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenItemNotFound()
    {
        // Arrange
        var itemId = 1;
        var updateRequest = new TodoItemUpdateRequest { Description = "Updated" };

        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync((TodoItem?)null);

        // Act
        var result = await _service.UpdateAsync(itemId, updateRequest);

        // Assert
        Assert.Null(result);
        _repoMock.Verify(r => r.GetByIdAsync(itemId), Times.Once);
        _repoMock.Verify(r => r.UpdateAsync(It.IsAny<TodoItem>()), Times.Never);
        _mapperMock.Verify(m => m.Map(It.IsAny<TodoItemUpdateRequest>(), It.IsAny<TodoItem>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_WithCompleteData_ReturnsResponse()
    {
        // Arrange
        var dueDate = DateTime.Now.AddDays(7);
        var createRequest = new TodoItemCreateRequest 
        { 
            Name = "Complete Task", 
            Description = "Task description",
            DueDate = dueDate,
            State = TodoState.InProgress 
        };
        var todoItem = new TodoItem 
        { 
            Id = 0, 
            Name = "Complete Task", 
            Description = "Task description",
            DueDate = dueDate,
            State = TodoState.InProgress 
        };
        var savedTodoItem = new TodoItem 
        { 
            Id = 5, 
            Name = "Complete Task", 
            Description = "Task description",
            DueDate = dueDate,
            State = TodoState.InProgress 
        };
        var response = new TodoItemResponse 
        { 
            Id = 5, 
            Name = "Complete Task", 
            Description = "Task description",
            DueDate = dueDate,
            State = TodoState.InProgress 
        };

        _mapperMock.Setup(m => m.Map<TodoItem>(createRequest)).Returns(todoItem);
        _repoMock.Setup(r => r.AddAsync(todoItem)).ReturnsAsync(savedTodoItem);
        _mapperMock.Setup(m => m.Map<TodoItemResponse>(todoItem)).Returns(response);

        // Act
        var result = await _service.CreateAsync(createRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Complete Task", result.Name);
        Assert.Equal("Task description", result.Description);
        Assert.Equal(dueDate, result.DueDate);
        Assert.Equal(TodoState.InProgress, result.State);
        _repoMock.Verify(r => r.AddAsync(todoItem), Times.Once);
        _mapperMock.Verify(m => m.Map<TodoItem>(createRequest), Times.Once);
        _mapperMock.Verify(m => m.Map<TodoItemResponse>(todoItem), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithStateChange_ReturnsUpdatedResponse()
    {
        // Arrange
        var itemId = 1;
        var updateRequest = new TodoItemUpdateRequest { State = TodoState.Completed };
        var existingItem = new TodoItem { Id = itemId, Name = "Task", State = TodoState.InProgress };
        var updatedItem = new TodoItem { Id = itemId, Name = "Task", State = TodoState.Completed };
        var response = new TodoItemResponse { Id = itemId, Name = "Task", State = TodoState.Completed };

        _repoMock.Setup(r => r.GetByIdAsync(itemId)).ReturnsAsync(existingItem);
        _mapperMock.Setup(m => m.Map(updateRequest, existingItem)).Returns(updatedItem);
        _repoMock.Setup(r => r.UpdateAsync(updatedItem)).ReturnsAsync(true);
        _mapperMock.Setup(m => m.Map<TodoItemResponse>(updatedItem)).Returns(response);

        // Act
        var result = await _service.UpdateAsync(itemId, updateRequest);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(TodoState.Completed, result.State);
        Assert.Equal("Task", result.Name);
    }
}