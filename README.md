# TODO API Client

This project is a client written in JavaScript, intended to interact with the REST API at todo-api.coderslab.pl. It allows users to create, download, update and delete tasks and related operations.

## Features

1. **List all tasks**: Retrieves all the tasks from the server.
2. **List all operations for a task**: Fetches all operations related to a specific task.
3. **Create a task**: Lets users add a new task with a title and description.
4. **Create an operation for a task**: Enables users to add operations for a specific task.
5. **Delete a task**: Allows users to remove a task.
6. **Delete an operation**: Allows users to remove an operation.
7. **Update an operation**: Users can modify an operation.
8. **Update a task**: Lets users modify the title, description, or status of a task.

## Prerequisites

1. Modern web browser with JavaScript enabled.
2. An active internet connection.

## Usage

- For creating a task, input the title (must be at least 5 characters) and description and then click the "Add" button.
- To add an operation for a task, enter the description (at least 5 characters) and click on the "Add" button.
- Use the "+15m" and "+1h" buttons to add time to the operations.
- Use the "Delete" button to remove tasks or operations.
- Use the "Finish" button to mark a task as completed.

## Security Note

For demonstration purposes, an API key is hardcoded in the project. It's essential not to expose such sensitive information in production apps. Always use environment variables or secure vaults to store such credentials.

