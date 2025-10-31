using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace ToDoApi.Services;

public interface IODataService
{
    IActionResult ProcessQuery<T>(IQueryable<T> queryable, ODataQueryOptions<T> queryOptions);
}

public class ODataService : IODataService
{
    /// <summary>
    /// Processes OData query options and returns properly formatted response with count support
    /// </summary>
    /// <typeparam name="T">The entity type</typeparam>
    /// <param name="queryable">The source queryable</param>
    /// <param name="queryOptions">OData query options from the request</param>
    /// <returns>ActionResult with proper OData format</returns>
    public IActionResult ProcessQuery<T>(IQueryable<T> queryable, ODataQueryOptions<T> queryOptions)
    {
        var filteredQueryable = queryable;
        if (queryOptions.Filter != null)
        {
            filteredQueryable = queryOptions.Filter.ApplyTo(queryable, new ODataQuerySettings()).Cast<T>();
        }
        
        var totalCount = filteredQueryable.Count();
        var result = queryOptions.ApplyTo(queryable);
        
        if (queryOptions.Count?.Value == true)
        {
            return new OkObjectResult(new Dictionary<string, object>
            {
                { "value", result },
                { "@odata.count", totalCount }
            });
        }
        
        return new OkObjectResult(result);
    }
}