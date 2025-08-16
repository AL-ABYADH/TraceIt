## `modules/` Directory

This folder contains feature modules for the web application. Each module encapsulates related components, hooks, and services for a specific domain or feature (e.g., user, diagram, project).

Make each distinct feature in a module a separate sub/mini module

### Guidelines

- Organize code by feature, not by type. Each module should have its own folder with components, hooks, and services.
- Keep modules decoupled and reusable. Avoid cross-imports between unrelated modules.
- Place only feature-specific logic here. Shared or generic code should go in `components/`, `hooks/`, or `services/` at the root level.

### Example Structure

```
modules/
  user/
    components/
    hooks/
    services/
    index.ts
  chat/
    components/
    hooks/
    services/
    index.ts
```
