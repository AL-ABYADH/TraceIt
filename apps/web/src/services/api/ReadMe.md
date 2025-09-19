## `api/` Directory

This folder contains the REST API client setup and endpoint definitions for the application.

### Guidelines

1. **Global HTTP Methods**
   - Create a single global file (e.g., `client.ts`) that exports generic HTTP methods: `get`, `post`, `put`, `patch`, and `delete`.
   - These functions should handle all HTTP requests and responses, error handling, 
    token management should be done via axios interceptors or Next Request / Response.

2. **Module Endpoint Classes**
   - For each feature module, create a directory (e.g., `user/`, `project/`).
   - Inside each module directory, create a file (e.g., `endpoints.ts`) that defines a class with static fields for all endpoints related to that module.
   - Example:
     ```ts
     // user/endpoints.ts
     export class UserEndpoints {
       static getProfile = '/user/profile';
       static updateProfile = '/user/profile/update';
       // ...other endpoints
     }
     ```

3. **Submodule CRUD Files**

   - For each submodule (e.g., `user/permissions`), create a file containing all CRUD operations for that submodule using the global HTTP methods and the static endpoint fields.
   - Example:
     ```ts
     // user/permissions.ts
     import { get, post, put, del } from '../client';
     import { UserEndpoints } from './endpoints';

     export const fetchPermissions = () => get(UserEndpoints.getPermissions);
     export const addPermission = (data) => post(UserEndpoints.addPermission, data);
     export const updatePermission = (id, data) => put(`${UserEndpoints.updatePermission}/${id}`, data);
     export const deletePermission = (id) => del(`${UserEndpoints.deletePermission}/${id}`);
     ```

### Benefits
- Centralizes HTTP logic for consistency and maintainability.
- Keeps endpoint definitions organized and discoverable.
- Makes CRUD operations for each submodule clear and easy to extend.
