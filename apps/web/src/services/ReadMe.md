## `services/` Directory

This folder contains shared service logic for the web application, such as API clients, WebSocket clients, global state and indexDb if needed.

### Guidelines

- Place only shared, app-wide service logic here. Feature-specific services should go in their respective module folders.
- Keep service code decoupled from UI and React state.
- Use these services in hooks, modules, or components as needed.
