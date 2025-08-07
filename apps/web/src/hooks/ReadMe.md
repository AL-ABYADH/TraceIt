## `hooks/` Directory

This folder contains custom React hooks used throughout the web application.

 manage state, side effects, data fetching, and other behaviors

### Guidelines
- Place only shared or generic hooks here. Feature-specific hooks should go inside their respective module folders (e.g., `modules/user/hooks`).

- Keep hooks focused and single-purpose for better reusability and testability.

### Example Use Cases
- Data fetching and caching
- Authentication and user state
- Form handling and validation
- WebSocket or API subscriptions
