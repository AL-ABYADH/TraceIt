## `user/` Module

This folder contains all code related to the user feature of the application. Each module can also have submodules for organizing related but distinct functionality (e.g., permissions, roles, settings).


### Structure
1- **In Case a module doesn't have children**
- `components/`: UI components specific to the user feature (e.g., UserProfile).
- `hooks/`: Custom React hooks for user-related logic (e.g., useUser).
- `services/`: Service functions for data fetching, API calls, and business logic.

2- **In Case a module had submodules**

- `[submodule name]/`: Subfolder for related but distinct user functionality (e.g., `something/ permissions/`, `roles/`). Each submodule can have its own components, hooks, and services.

each submodules are related to the main module but for more clarity and code maintainability dividing the module depending on screens and treating each screen as a sub-module will pay out in the long run  

### Guidelines
- Use services for data and business logic, hooks for stateful logic, and components for UI.
- Organize related but distinct features into submodules for better separation and scalability.
- Each submodule should follow the same structure as the main module (components, hooks, services, etc.).
- Export from `index.ts` to provide a clean API for other modules or app routes.



