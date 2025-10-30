# ToDoApp

A full-stack Todo application built with React TypeScript frontend and ASP.NET Core Web API backend.

## Architecture

- **Frontend**: React 19 with TypeScript, Vite, PrimeReact UI components
- **Backend**: ASP.NET Core 8.0 Web API with Entity Framework Core
- **Database**: SQL Server Express
- **Testing**: xUnit for backend, Entity Framework In-Memory for testing

Before you begin, ensure you have the following installed on your machine:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **.NET 8.0 SDK**
   - Download from [Microsoft .NET](https://dotnet.microsoft.com/download/dotnet/8.0)
   - Verify installation: `dotnet --version`

3. **SQL Server Express** (or SQL Server)
   - Download from [Microsoft SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - Or use SQL Server LocalDB: `sqllocaldb info`

### Running the application
   Run API - dotnet run, if sql server running db will be created and migrated on startup
   Run FE - npm run dev

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
