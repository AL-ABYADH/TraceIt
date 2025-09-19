## Guidelines
- Only place routing-related files (pages, layouts, templates, loading, error boundaries) in this directory.

- Keep business logic, feature modules, and reusable components outside the `app/` directory (e.g., in `modules/`, `components/`, or `hooks/`).
route subtree.

- Add `loading.tsx` and `error.tsx` for route-specific loading and error UI.

- Keep route folders focused—avoid mixing unrelated features in a single route.

- Import feature logic and UI from modules or shared folders to compose your pages.

### Example Structure

```
app/
  user-profile/
    page.tsx 
    error.tsx
    layout.tsx
    loading.tsx
```

