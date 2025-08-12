## `middleware/` Directory

- This folder contains custom middleware for the Next.js web application.

- NextRequest and NextResponse are special classes  provided by Next.js to handle HTTP requests and responses at the edge (before reaching route/response handlers).


### Guidelines
- Place only middleware files here (e.g., `auth.ts` for authentication checks).

- middleware function and middleware files are the entry point for Next mIddleware , it invokes the function named middleware automatically

- Use middleware to handle logic that should run on every request or on specific routes (e.g., protecting private pages).

- Export a `middleware` function and an optional `config` object to specify which routes the middleware applies to.

`a middleware.ts file example was added for convince`

### Example Use Cases
- Authentication and access control
- Redirecting unauthenticated users
- Logging or analytics
- Custom headers or response modifications

### Usage
Middleware in this folder will be automatically picked up by Next.js if named correctly (e.g., `middleware.ts` or `[name].ts`).
Configure the `matcher` in the `config` export to target specific routes and don't forget to write the middleware function and export as well.


