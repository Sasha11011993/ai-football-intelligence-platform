# Supabase Persistence

## Purpose

Supabase is the future persistence layer for real football data, ingestion history, AI reports, anomaly alerts, and automation logs.

The intended split is:

```text
External Sources / Parsers / n8n
  -> Raw snapshots and ingestion logs
  -> Normalized Postgres tables
  -> Analytics views / metrics layer
  -> Dashboard + AI Context Builder
```

## Storage Responsibilities

### Supabase Postgres

Stores normalized and queryable records:

- teams;
- players;
- competitions;
- matches;
- fixtures;
- team match stats;
- player match stats;
- tactical match metrics;
- ingestion sources and runs;
- raw ingestion event metadata;
- AI reports and insights;
- anomaly alerts;
- automation runs.

### Supabase Storage

Stores larger or file-like artifacts:

- raw JSON/HTML parser snapshots;
- CSV/Excel imports;
- exported Markdown/PDF reports.

Initial buckets:

- `raw-snapshots`
- `imports`
- `exports`

### n8n

n8n remains the orchestration layer:

- scheduled parser/API fetch;
- retries and workflow status;
- dashboard-triggered workflow runs;
- forwarding normalized payloads to app/API routes;
- preparing notification-ready outputs.

n8n should not be the primary long-term data store.

## Security Defaults

- RLS is enabled on all public tables.
- Normalized football reference/performance tables allow public read access for portfolio demo use.
- Ingestion, raw events, AI reports, alerts, and automation runs are not publicly readable by default.
- Writes are server-side only through service role credentials or trusted backend paths.
- The service role key must never be exposed to the browser.
- Storage buckets are private by default; serve exports through signed URLs or backend endpoints later.

## Migration

The initial schema is stored in:

`supabase/migrations/0001_real_data_persistence.sql`

Apply it only after selecting or creating the correct Supabase project and confirming the target environment.

## Environment Variables

Future app phases should use:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Only `NEXT_PUBLIC_*` values may reach the browser. `SUPABASE_SERVICE_ROLE_KEY` is backend-only.

## Next Implementation Steps

1. Reauthenticate the Supabase app connection if MCP access is needed.
2. Select or create the target Supabase project.
3. Apply the migration.
4. Run Supabase security/performance advisors.
5. Seed demo data into Supabase.
6. Add Next.js Supabase clients and dashboard read flow.
7. Add n8n ingestion workflow that writes through a trusted backend endpoint.

