---
applyTo: '**/*.ts,**/*.tsx,**/*.js,**/*.jsx'
---

# Convex guidelines

## Function guidelines

### New function syntax

- ALWAYS use the new function syntax for Convex functions. For example:

```typescript
import { query } from './_generated/server'
import { v } from 'convex/values'
export const f = query({
  args: {},
  handler: async (ctx, args) => {
    // Function body
  },
})
```

### Http endpoint syntax

- HTTP endpoints are defined in `convex/http.ts` and require an `httpAction` decorator. For example:

```typescript
import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
const http = httpRouter()
http.route({
  path: '/echo',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const body = await req.bytes()
    return new Response(body, { status: 200 })
  }),
})
```

- HTTP endpoints are always registered at the exact path you specify in the `path` field.

### Validators

- Below is an example of an array validator:

```typescript
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export default mutation({
  args: {
    simpleArray: v.array(v.union(v.string(), v.number())),
  },
  handler: async (ctx, args) => {
    //...
  },
})
```

### Function registration

- Use `internalQuery`, `internalMutation`, and `internalAction` to register internal functions. These are private and can only be called by other Convex functions. Always imported from `./_generated/server`.
- Use `query`, `mutation`, and `action` to register public functions. Do NOT use them for sensitive internal functions.
- ALWAYS include argument validators for all Convex functions.

### Function calling

- Use `ctx.runQuery`, `ctx.runMutation`, `ctx.runAction` with `FunctionReference` objects. Do NOT pass functions directly.
- ONLY call an action from another action if crossing runtimes. Otherwise extract shared code into a helper.
- When calling same-file functions, add a type annotation on the return value.

### Function references

- Use `api` object for public functions, `internal` for private functions (both from `convex/_generated/api.ts`).
- File-based routing: `convex/example.ts` function `f` → `api.example.f`.

## Validator guidelines

- `v.bigint()` is deprecated. Use `v.int64()` instead.
- Use `v.record()` for record types. `v.map()` and `v.set()` are not supported.

## Schema guidelines

- Always define schema in `convex/schema.ts`.
- System fields `_creationTime` and `_id` are added automatically.
- Include all index fields in index name: `"by_field1_and_field2"`.
- Index fields must be queried in defined order.

## TypeScript guidelines

- Use `Id<'tableName'>` for document ID types.
- Be strict with types around document IDs.

## Query guidelines

- Do NOT use `filter`. Use `withIndex` instead.
- Queries do NOT support `.delete()`. Collect and iterate with `ctx.db.delete()`.
- Default order is ascending `_creationTime`.

## Mutation guidelines

- `ctx.db.replace` for full replacement, `ctx.db.patch` for shallow merge.

## Action guidelines

- Add `"use node";` only for Node.js built-in modules.
- Never add `"use node";` to files with queries or mutations.
- Never use `ctx.db` inside actions.

## Scheduling guidelines

- Only use `crons.interval` or `crons.cron`. NOT `crons.hourly/daily/weekly`.
- Always import `internal` from `_generated/api` for cron function references.

## File storage guidelines

- `ctx.storage.getUrl()` returns signed URL or `null`.
- Query `_storage` system table for metadata, not deprecated `ctx.storage.getMetadata`.
