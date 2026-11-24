<div align="center">

<img src="https://raw.githubusercontent.com/Studio1HQ/Studio1HQ/main/assets/banners/10X-your-coding-workflow.webp" alt="AI Coding Workflow Experiments: Four small TypeScript tasks built to test AI coding workflows" width="100%" />

<br />
<br />

# AI Coding Workflow Experiments

### Four small TypeScript tasks built to test AI coding workflows

Four self-contained TypeScript projects, each the output of a coding task run with an AI coding agent: rate limiting, lint setup, an analytics endpoint and keyset pagination with ByteRover context rules.

<br />

[![Built by Studio1](https://img.shields.io/badge/Built_by_Studio1-f97316?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMzVDMCAxNi42ODA3IDE0LjA3NDQgMS42NDg0NCAzMiAwLjEyNjk1M1YxNDFINTEuMDUyM0M1Mi40MzA4IDEzNy4zNDQgNTQuNzQ0NiAxMzMuNjg5IDU3Ljk5MzggMTMwLjAzM0M2MS4xNDQ2IDEyNi41MDggNjQuNjg5MiAxMjMuNDQgNjguNjI3NyAxMjAuODI5QzcyLjU2NjIgMTE4LjM0OSA3Ni4zNTY5IDExNi43ODIgODAgMTE2LjEyOVY4Ni43NTQ0Qzc1LjQ3MDggODcuOTI5MiA3MS4zODQ2IDg5LjY5MTkgNjcuNzQxNSA5Mi4wNDE1QzY0IDk0LjUyMjUgNjAuNzUwOCA5Ny40NiA1Ny45OTM4IDEwMC44NTRDNTYuNTM0NSAxMDIuNzIgNTUuMjU0NSAxMDQuNjU5IDU0LjE1MzkgMTA2LjY3MVYwSDEyNUMxNDQuMzMgMCAxNjAgMTUuNjY5OSAxNjAgMzVWMTI1QzE2MCAxNDQuMzMgMTQ0LjMzIDE2MCAxMjUgMTYwSDEyNFYxOEgxMDQuOTQ4QzEwMy41NjkgMjEuNjgxNiAxMDEuMjU1IDI1LjM2MjggOTguMDA2MiAyOS4wNDQ0Qzk0Ljg1NTQgMzIuNTk0MiA5MS4zMTA4IDM1LjY4NDEgODcuMzcyMyAzOC4zMTRDODMuNDMzOCA0MC44MTIgNzkuNjQzMSA0Mi4zODk2IDc2IDQzLjA0NzRWNzIuNjMwNEM4MC41MjkyIDcxLjQ0NzMgODQuNjE1NCA2OS42NzI0IDg4LjI1ODUgNjcuMzA1N0M5MiA2NC44MDc2IDk1LjI0OTIgNjEuODQ5MSA5OC4wMDYyIDU4LjQzMDdDOTkuNDY1NSA1Ni41NTEzIDEwMC43NDUgNTQuNTk4NiAxMDEuODQ2IDUyLjU3MjNWMTYwSDM1QzE1LjY3IDE2MCAwIDE0NC4zMyAwIDEyNVYzNVoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4K)](https://studio1hq.com)
[![Built with ByteRover](https://img.shields.io/badge/Built_with_ByteRover-141414?style=for-the-badge)](https://byterover.dev)

[ByteRover docs](https://docs.byterover.dev) &nbsp;·&nbsp; [ByteRover](https://byterover.dev) &nbsp;·&nbsp; [More examples](https://github.com/Studio1HQ) &nbsp;·&nbsp; [studio1hq.com](https://studio1hq.com)

</div>

<br />

## Overview

This repo holds four small TypeScript projects, `Execution1` to `Execution4`. Each is the result of a focused coding task run with an AI coding agent, kept side by side so you can compare how the work turns out. The repo does not include the prompts, so treat it as a record of outputs rather than a tutorial.

`Execution4` is set up with [ByteRover](https://byterover.dev) rules and an MCP config, so the agent can query and update a local context tree with the `brv` CLI while it works.

## Features

- **Execution1, rate limiting**: an in-memory rate limiter (`src/lib/rateLimit.ts`) and an orders API (`src/api/orders.ts`) that returns HTTP 429 and `X-RateLimit-Remaining` headers. Eight Jest tests cover normal flow, limit exceeded, window reset and per-IP tracking.
- **Execution2, lint and format setup**: ESLint (`@typescript-eslint`) and Prettier configs around a small `processOrder` function, with Jest tests.
- **Execution3, analytics endpoint**: an Express router that validates a batch of analytics events and reports per-event validation errors, plus a SQL schema and an initial migration for an `analytics_events` table.
- **Execution4, keyset pagination**: a `ReportsAPI` with keyset pagination over 50 deterministic mock reports, filterable by status, with a `verify_reports.ts` script.
- **Agent context files**: `Execution4` includes `AGENTS.md`, Cursor and Augment rules, and a Cursor MCP config for the `brv` server.

## Tech stack

| Layer | Tool |
| --- | --- |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Testing | [Jest](https://jestjs.io) with ts-jest |
| API | [Express](https://expressjs.com) (Execution3) |
| Lint and format | ESLint, Prettier (Execution2) |
| Agent context | [ByteRover](https://byterover.dev) CLI (`brv`) (Execution4) |

## Getting started

### Prerequisites

- Node.js 18 or later
- npm
- The ByteRover CLI (`brv`) only if you want to use the agent context in `Execution4`

### Installation

Each folder is its own project with its own `package.json`.

```bash
git clone https://github.com/Studio1HQ/10X-your-coding-workflow.git
cd 10X-your-coding-workflow/Execution1
npm install
```

### Run

`Execution1` and the other Jest-based projects:

```bash
npm test
```

`Execution1` also provides `npm run test:watch`, `npm run test:coverage`, `npm run build` and `npm run dev`.

`Execution4` has no `package.json` scripts. Run the verification script with `ts-node`:

```bash
npx ts-node verify_reports.ts
```

## How it works

```text
Execution1/   Rate limiting for an orders API (rateLimit.ts, orders.ts, Jest tests)
Execution2/   ESLint and Prettier setup, processOrder function, Jest tests
Execution3/   Analytics events endpoint, SQL schema and migration, Jest tests
Execution4/   Keyset pagination for reports, ByteRover rules, AGENTS.md, todos.md
```

In `Execution1`, `RateLimiter` keeps a per-IP counter in a `Map` with a reset time, defaulting to 5 requests per 60 seconds, and cleans up expired entries on an interval. `Execution4/todos.md` records the agent's exploration steps: searching for TODO notes and looking for shared pagination utilities before writing `pagination.ts` and `reports.ts`.

## Resources

- [ByteRover documentation](https://docs.byterover.dev): the context tree and `brv` CLI used in Execution4.
- [ByteRover](https://byterover.dev): memory and context layer for coding agents.

<br />

---

<div align="center">

<a href="https://studio1hq.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-dark.svg" />
    <img src="https://raw.githubusercontent.com/Studio1HQ/website/main/brand/studio1-logo-on-light.svg" alt="Studio1" width="160" />
  </picture>
</a>

Built by **[Studio1](https://studio1hq.com)**, the technical content and DevRel partner for devtool teams. Made with [ByteRover](https://byterover.dev).<br />
Browse more open-source examples at [github.com/Studio1HQ](https://github.com/Studio1HQ).

[![Website](https://img.shields.io/badge/studio1hq.com-0b0807?style=for-the-badge&logo=googlechrome&logoColor=white)](https://studio1hq.com)
[![Book a call](https://img.shields.io/badge/Book_a_strategy_call-f97316?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://cal.com/studio1/collab)
[![X](https://img.shields.io/badge/%40Studio1HQ-141414?style=for-the-badge&logo=x&logoColor=white)](https://x.com/Studio1HQ)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/studio1hq/)

<sub><a href="https://studio1hq.com">studio1hq.com</a> · Technical content, docs, video and DevRel for devtools</sub>

</div>
