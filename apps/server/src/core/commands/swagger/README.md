# @openapi JSDoc

A friendly, compact reference for using `@openapi` JSDoc blocks (or `/* openapi ... */` blocks) in your Nest controllers so the `gen-openapi-per-controller` generator picks up the intended OpenAPI overrides. This document explains:

* where to put the override,
* what JSON shape to use,
* all supported/top-level properties the generator understands,
* how request/response overrides are normalized and merged,
* examples (including arrays, DTO refs, enums),
* common pitfalls and tips.

---

## Where to put the override

The generator looks for override JSON in three places (in order of preference):

1. JSDoc on the method:

   ```ts
   /**
    * @openapi
    * {
    *   "summary": "My summary",
    *   "request": { ... }
    * }
    */
   @Get()
   myMethod() { ... }
   ```

2. Block comment `/* openapi ... */` immediately above the method (adjacent to decorators is supported):

   ```ts
   /* openapi
   {
     "responses": { ... }
   }
   */
   @Post()
   action() { ... }
   ```

3. JSDoc on a decorator (comments between decorators are also scanned). E.g., inline above `@Get()` or adjacent decorator.

**Important**: The parser extracts the first `{ ... }` JSON it finds inside the comment (it tries to be lenient but you should provide valid JSON). Trailing commas will be removed by a lenient attempt, but prefer valid JSON.

---

## How the generator treats your override

* It parses the JSON you put in the comment, then merges it with generated bits.
* For `request`-related overrides the generator **normalizes** them and merges with generated request (see **Request normalization** below).
* For `responses`: if you provide an override `responses` object it will be `deepMerge`ed into generator defaults (the generator still supplies 200/400/500 and 401/404 when appropriate).
* The generator also scans your override for `"$ref"` strings and will add imports/registrations for referenced components (e.g. `#/components/schemas/UserDto` → it imports the shared schema variable name `userSchema`, registers it via `registerMultiple`, and emits the `$ref`).

---

## Top-level properties you can set

The generator will accept these top-level keys in the override object (and will include them in the emitted `registry.registerPath`):

* `summary` (string)
* `description` (string)
* `deprecated` (boolean)
* `operationId` (string)
* `externalDocs` (OpenAPI `externalDocs` object)
* `security` (OpenAPI security array)
* `parameters` (OpenAPI `parameters` array) — *if present this becomes the top-level `parameters` array; otherwise the generator uses `request.params` to hold zod-style param schemas; you can use either approach.*
* `request` (object) — see **Request normalization**
* `responses` (object) — full OpenAPI responses object (merged with defaults)


---

## Request normalization and allowed keys

If you supply `request` or `requestBody` in the override, the generator will normalize it into the canonical request shape used by the registry:

* Acceptable request keys after normalization:
  `body`, `params`, `query`, `cookies`, `headers`.

* Normalization rules:

  * Top-level `requestBody` is moved to `request.body`.
  * `request.requestBody` is renamed to `request.body`.
  * Only the allowed request keys are kept under `request` (others are left at path-level if present).

* Content merging:

  * The generator generates a `request` object from detected zod schemas / body DTOs found in the controller (e.g. when you used `@Body(zodBody(userSchema))`).
  * If you provide `request` override it is deep-merged with generated request so you can change just `description`, `required`, or `content` without re-specifying everything.

**Examples**

1. Change only the body description:

```js
/* openapi
{
  "request": {
    "body": { "description": "Custom description for request body" }
  }
}
*/
@Put(":id")
update(...) { ... }
```

2. Tell generator to use a shared schema identifier for params (string value):

```js
/* openapi
{
  "request": {
    "params": "uuidParamsSchema"
  }
}
*/
@Get(":id")
find(...) { ... }
```

If you supply a string that matches an imported variable (or a name exported by `@repo/shared-schemas`), the tool will attempt to import that identifier and use it.

---

## Responses: supported patterns

You can fully supply OpenAPI `responses` for a method (object keyed by status codes). Generator will:

* merge your `responses` onto sensible defaults (200, 400, 500, +401/+404 if applicable),
* scan your `responses` for `"$ref"` and import/register referenced schemas automatically,
* accept inline schema objects or `$ref` to components.

**Common useful forms**

1. Single DTO response

```json
{
  "responses": {
    "200": {
      "description": "Successful response",
      "content": {
        "application/json": {
          "schema": { "$ref": "#/components/schemas/UserDto" }
        }
      }
    }
  }
}
```

2. Array of DTOs (exactly what you asked for):

```json
{
  "responses": {
    "200": {
      "description": "Successful response",
      "content": {
        "application/json": {
          "schema": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/UserDto" }
          }
        }
      }
    }
  }
}
```

3. Inline simple object:

```json
{
  "responses": {
    "200": {
      "description": "OK",
      "content": {
        "application/json": {
          "schema": { "type": "object", "properties": { "success": { "type": "boolean" } } }
        }
      }
    }
  }
}
```

4. Partial override that only changes description (generator will keep schema it inferred):

```json
{
  "responses": {
    "200": { "description": "Everything is rosy" }
  }
}
```

**Tip:** If your controller method return type is `Promise<UserDto[]>` the generator tries to infer `UserDto` automatically. If inference fails or you want to be explicit, supply the override with the `Array` schema (example #2).

---

## How to make the generator import shared schemas (zod schemas / DTOs)

The generator looks across:

* the method signature (calls to `zodBody(...)`, `zodParam(...)`, etc.),
* any strings you put in `request` (e.g., `"uuidParamsSchema"`),
* `$ref` occurrences inside your override.

When it finds a referenced component name (like `UserDto` via `$ref`) it computes the variable name mapping (e.g. `userSchema`) and will add an import like:

```ts
import { userSchema, uuidParamsSchema, updateUserSchema } from "@repo/shared-schemas";
```

and it will also emit a `registerMultiple(registry, { UserDto: userSchema, ... })` block so components are registered.

**How to reference shared schemas in overrides:**

* Use `$ref: "#/components/schemas/YourDtoName"` in response or other schema places.
* Or use the actual exported variable name (e.g. `"uuidParamsSchema"`) for `request.params` / `request.query` etc — the generator will try to resolve that identifier to an import.

---

## How to express enums (zod enum, ParseEnumPipe, or shared enum schema)

If your route parameter is a zod enum schema (e.g. you pass `zodParam(subTypeEnumSchema)`), prefer to:

* declare the param using `@Param(zodParam(subTypeEnumSchema))` — the generator will:

  * detect the schema identifier `subTypeEnumSchema`,
  * add an import for it,
  * emit `request.params: subTypeEnumSchema`,
  * preserve path token name (e.g., `/actors/subtype/{subtype}`) and the schema will include the allowed enum values in the OpenAPI request param definition.

If the generator does not detect the enum automatically, you can override explicitly:

```js
/* openapi
{
  "request": {
    "params": "subTypeEnumSchema"
  }
}
*/
@Get("subtype/:subtype")
listBySubtype(...) { ... }
```

That forces `params` to the proper shared zod enum schema and the values appear in OpenAPI.

---

## Examples — Controllers + JSDoc overrides

### Example 1 — Update user (single DTO response)

Controller:

```ts
@Put(":id")
/* openapi
{
  "responses": {
    "200": {
      "description": "Updated user returned",
      "content": {
        "application/json": {
          "schema": { "$ref": "#/components/schemas/UserDto" }
        }
      }
    }
  }
}
*/
updateProfile(
  @Param(zodParam(uuidParamsSchema)) userId: UuidParamsDto,
  @Body(zodBody(updateUserSchema)) dto: UpdateUserDto
): Promise<UserDto> { ... }
```

Generated path (simplified):

```ts
request: {
  body: { ... $ref: "#/components/schemas/UpdateUserDto" },
  params: uuidParamsSchema
},
responses: {
  200: { content: { "application/json": { schema: { $ref: "#/components/schemas/UserDto" } } } },
  400: {...}, 404: {...}, 500: {...}
}
```

### Example 2 — Return array of DTOs (explicit override)

If generator fails to infer `UserDto[]` you can explicitly override:

```ts
/* openapi
{
  "responses": {
    "200": {
      "description": "List of users",
      "content": {
        "application/json": {
          "schema": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/UserDto" }
          }
        }
      }
    }
  }
}
*/
@Get(":id")
find(...): Promise<UserDto[]> { ... }
```

### Example 3 — Enum path param preserved and imported

Controller:

```ts
/* openapi
{
  "summary": "Get by subtype using enum schema",
  "request": { "params": "subTypeEnumSchema", "query": "uuidParamsSchema" }
}
*/
@Get("subtype/:subtype")
listBySubtype(
  @Query(zodQuery(uuidParamsSchema)) params: UuidParamsDto,
  @Param(zodParam(subTypeEnumSchema)) param: SubTypeEnumDto,
): Promise<Actor[]> { ... }
```

Generated piece:

```ts
path: "/actors/subtype/{subtype}",
request: {
  params: subTypeEnumSchema,
  query: uuidParamsSchema
}
```

OpenAPI for `params` will then contain the enum values present in `subTypeEnumSchema`.

---

## Full override cheat-sheet (valid JSON snippet)

```json
{
  "summary": "short summary",
  "description": "long description here",
  "deprecated": false,
  "operationId": "myOperation",
  "externalDocs": { "description": "Readme", "url": "https://..." },
  "security": [ { "bearerAuth": [] } ],

  "parameters": [ /* optional OpenAPI parameters arr (top-level) */ ],

  "request": {
    "body": {
      "description": "Custom body description",
      "required": true,
      "content": {
        "application/json": {
          "schema": { "$ref": "#/components/schemas/MyDto" }
        }
      }
    },
    "params": "uuidParamsSchema",   /* string -> generator will resolve import if possible */
    "query": "myQuerySchema",
    "cookies": "myCookiesSchema",
    "headers": "myHeadersSchema"
  },

  "responses": {
    "200": {
      "description": "OK",
      "content": {
        "application/json": {
          "schema": { "$ref": "#/components/schemas/MyDto" }
        }
      }
    },
    "400": { "description": "Bad request" }
  }
}
```

---

## Practical tips & gotchas

* **Always prefer valid JSON** in the `@openapi` block. The parser is somewhat lenient (it strips `*` from JSDoc and removes trailing commas in a second pass), but valid JSON avoids surprises.
* **Use `$ref` to point to component DTOs** (e.g. `#/components/schemas/UserDto`) — the generator will detect `$ref` occurrences and add imports & `registerMultiple(...)` entries for you.
* **If return type inference fails** (e.g. `Promise<UserDto[]>` not recognized), set `responses` explicitly to the array form shown above.
* **Do not expect the generator to use `callbacks` or `servers`** inside method overrides (they are ignored by design in your current generator build).
* **Prefer `@Param(zodParam(yourSchema))`** when the path param has validation/enum: the generator will set `request.params` to `yourSchema` and preserve allowed values.
* **Avoid using parameter *variable names* as path schema identifiers** — the generator will only set `request.params` to schema identifiers it detects (good). If the generator picks something wrong, override `request.params` explicitly.
* **If you change only part of a request/response (e.g. only description)** you can provide just that partial structure in the override — the generator will merge it with generated content rather than replacing the whole object.

---

## Debugging tips

* If your generated OpenAPI is missing a `$ref` import:

  * Make sure the `$ref` component name matches the DTO name (e.g. `UserDto`) and the corresponding shared schema variable exists in `@repo/shared-schemas` (e.g. `userSchema`).
  * You can put the schema var explicitly in `request.*` strings: `"params": "uuidParamsSchema"`. The generator will try to resolve that identifier.
* If a route token became `{params}` or `{id}` unexpectedly:

  * Ensure your route string contains the token (`@Put(":id")`), and that you didn't accidentally set `@Param()` with a string that confuses positional mapping. The generator prefers the path token itself (e.g. `id`) and also checks `@Param('tokenName')`.
* If array responses become `{ type: "array", items: { type: "object", properties: {} } }` (empty item):

  * Either supply `responses` override with `items: { "$ref": "#/components/schemas/YourDto" }`, or ensure the method return signature contains `SomethingDto[]` or `Promise<SomethingDto[]>` so the generator can infer the DTO name.

---

## Quick reference: what to put where

* To change only the success response schema to an array of `UserDto`:

  * Put a `responses.200.content.application/json.schema` object using `type: "array", items: { "$ref": "#/components/schemas/UserDto" }`.
* To make `:subtype` validate against a zod enum:

  * Use `@Param(zodParam(subTypeEnumSchema))` in controller and/or add `request.params: "subTypeEnumSchema"` in `@openapi` override.
* To add extra metadata (summary, operationId, etc):

  * Put them at top-level of the override JSON.

---

## Minimal valid examples

JSDoc style (inline):

```ts
/**
 * @openapi { "summary": "Get users", "responses": { "200": { "description": "OK" } } }
 */
@Get()
getAll() { ... }
```

Block-style (preferred for longer JSON):

```ts
/* openapi
{
  "summary": "Get actors by subtype",
  "request": {
    "params": "subTypeEnumSchema",
    "query": "uuidParamsSchema"
  },
  "responses": {
    "200": {
      "description": "List of actors",
      "content": {
        "application/json": {
          "schema": { "type": "array", "items": { "$ref": "#/components/schemas/ActorDto" } }
        }
      }
    }
  }
}
*/
@Get("subtype/:subtype")
listProjectActorsBySubtype(...) { ... }
```

---