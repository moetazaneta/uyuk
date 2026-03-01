# Convex Guidelines

> Source: https://convex.link/convex_rules.txt (Official)
> Applies to: `convex/**/*.ts`

## Function Guidelines

### New Function Syntax

- ALWAYS use the new function syntax for Convex functions. For example:

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";
export const f = query({
  args: {},
  handler: async (ctx, args) => {
    // Function body
  },
});
```

### HTTP Endpoint Syntax

- HTTP endpoints are defined in `convex/http.ts` and require an `httpAction` decorator. For example:

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
const http = httpRouter();
http.route({
  path: "/echo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.bytes();
    return new Response(body, { status: 200 });
  }),
});
```

- HTTP endpoints are always registered at the exact path you specify in the `path` field.

### Validators

- Below is an example of an array validator:

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    simpleArray: v.array(v.union(v.string(), v.number())),
  },
  handler: async (ctx, args) => {
    //...
  },
});
```

- Below is an example of a schema with validators that codify a discriminated union type:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  results: defineTable(
    v.union(
      v.object({
        kind: v.literal("error"),
        errorMessage: v.string(),
      }),
      v.object({
        kind: v.literal("success"),
        value: v.number(),
      }),
    ),
  ),
});
```

- Valid Convex types and validators:

| Convex Type | TS/JS type  | Example Usage           | Validator                      | Notes                                                                                  |
| ----------- | ----------- | ----------------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| Id          | string      | `doc._id`               | `v.id(tableName)`              |                                                                                        |
| Null        | null        | `null`                  | `v.null()`                     | `undefined` is not valid. Use `null` instead.                                          |
| Int64       | bigint      | `3n`                    | `v.int64()`                    | Only BigInts between -2^63 and 2^63-1.                                                 |
| Float64     | number      | `3.1`                   | `v.number()`                   | All IEEE-754 double-precision floating point numbers.                                  |
| Boolean     | boolean     | `true`                  | `v.boolean()`                  |                                                                                        |
| String      | string      | `"abc"`                 | `v.string()`                   | UTF-8, must be valid Unicode. Max 1MB.                                                 |
| Bytes       | ArrayBuffer | `new ArrayBuffer(8)`    | `v.bytes()`                    | Max 1MB.                                                                               |
| Array       | Array       | `[1, 3.2, "abc"]`       | `v.array(values)`              | Max 8192 values.                                                                       |
| Object      | Object      | `{a: "abc"}`            | `v.object({property: value})`  | Plain objects only. Max 1024 entries. Fields must not start with "$" or "_".            |
| Record      | Record      | `{"a": "1", "b": "2"}` | `v.record(keys, values)`       | Keys must be ASCII, nonempty, not start with "$" or "_".                               |

### Function Registration

- Use `internalQuery`, `internalMutation`, and `internalAction` to register internal functions. These are private and can only be called by other Convex functions. Always imported from `./_generated/server`.
- Use `query`, `mutation`, and `action` to register public functions. These are exposed to the public Internet. Do NOT use them for sensitive internal functions.
- You CANNOT register a function through the `api` or `internal` objects.
- ALWAYS include argument validators for all Convex functions.
- If a function doesn't have a return value, it implicitly returns `null`.

### Function Calling

- Use `ctx.runQuery` to call a query from a query, mutation, or action.
- Use `ctx.runMutation` to call a mutation from a mutation or action.
- Use `ctx.runAction` to call an action from an action.
- ONLY call an action from another action if you need to cross runtimes (e.g. from V8 to Node). Otherwise, extract shared code into a helper async function.
- Minimize calls from actions to queries and mutations. They are transactions — splitting logic introduces race conditions.
- All calls take a `FunctionReference`. Do NOT pass the callee function directly.
- When calling a function in the same file, specify a type annotation on the return value:

```typescript
export const f = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return "Hello " + args.name;
  },
});

export const g = query({
  args: {},
  handler: async (ctx, args) => {
    const result: string = await ctx.runQuery(api.example.f, { name: "Bob" });
    return null;
  },
});
```

### Function References

- Use the `api` object from `convex/_generated/api.ts` for public functions.
- Use the `internal` object from `convex/_generated/api.ts` for internal functions.
- Convex uses file-based routing: a public function `f` in `convex/example.ts` → `api.example.f`.
- A private function `g` in `convex/example.ts` → `internal.example.g`.
- Nested directories work: `convex/messages/access.ts` function `h` → `api.messages.access.h`.

### API Design

- Convex uses file-based routing. Organize files thoughtfully within `convex/`.
- Use `query`, `mutation`, and `action` for public functions.
- Use `internalQuery`, `internalMutation`, and `internalAction` for private functions.

### Pagination

```typescript
import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listWithExtraArg = query({
  args: { paginationOpts: paginationOptsValidator, author: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_author", (q) => q.eq("author", args.author))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

- `paginationOpts` contains: `numItems` (v.number()), `cursor` (v.union(v.string(), v.null()))
- `.paginate()` returns: `page` (array), `isDone` (boolean), `continueCursor` (string)

## Validator Guidelines

- `v.bigint()` is deprecated. Use `v.int64()` instead.
- Use `v.record()` for record types. `v.map()` and `v.set()` are not supported.

## Schema Guidelines

- Always define schema in `convex/schema.ts`.
- Always import schema definition functions from `convex/server`.
- System fields `_creationTime` (v.number()) and `_id` (v.id(tableName)) are added automatically.
- Always include all index fields in the index name (e.g., `"by_field1_and_field2"` for `["field1", "field2"]`).
- Index fields must be queried in the same order they are defined.

## TypeScript Guidelines

- Use `Id<'tableName'>` from `./_generated/dataModel` for document ID types.
- For `Record` types, correctly provide key and value types:

```typescript
const idToUsername: Record<Id<"users">, string> = {};
```

- Be strict with types, especially around document IDs. Use `Id<'users'>` not `string`.
- Always use `as const` for string literals in discriminated union types.

## Full Text Search Guidelines

```typescript
const messages = await ctx.db
  .query("messages")
  .withSearchIndex("search_body", (q) =>
    q.search("body", "hello hi").eq("channel", "#general"),
  )
  .take(10);
```

## Query Guidelines

- Do NOT use `filter` in queries. Define an index and use `withIndex` instead.
- Convex queries do NOT support `.delete()`. `.collect()` results, iterate, and call `ctx.db.delete(row._id)`.
- Use `.unique()` for single document queries (throws if multiple match).
- For async iteration, use `for await (const row of query)` — not `.collect()` or `.take(n)`.
- Default order is ascending `_creationTime`. Use `.order('asc')` or `.order('desc')` to change.

## Mutation Guidelines

- `ctx.db.replace` — fully replace an existing document (throws if not found).
- `ctx.db.patch` — shallow merge updates into existing document (throws if not found).

## Action Guidelines

- Always add `"use node";` to files using Node.js built-in modules.
- Never add `"use node";` to files that also export queries or mutations.
- `fetch()` is available in the default runtime. No `"use node"` needed for `fetch()`.
- Never use `ctx.db` inside an action. Actions don't have database access.

## Scheduling Guidelines

### Cron Guidelines

- Only use `crons.interval` or `crons.cron`. Do NOT use `crons.hourly`, `crons.daily`, or `crons.weekly`.
- Both methods take a `FunctionReference`. Do NOT pass the function directly.
- Define crons by declaring `const crons = cronJobs()`, calling methods, and exporting as default.
- If a cron calls an internal function, always import `internal` from `_generated/api`, even if in the same file.

## File Storage Guidelines

- `ctx.storage.getUrl()` returns a signed URL. Returns `null` if file doesn't exist.
- Do NOT use deprecated `ctx.storage.getMetadata`. Query the `_storage` system table instead:

```typescript
const metadata = await ctx.db.system.get(args.fileId);
```

- Convex storage uses `Blob` objects. Convert to/from `Blob` when using storage.
