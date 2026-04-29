# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Overview

This is an **educational monorepo** ("從 Vibe Coding 到專業開發：React + Vite + 生態系整合講義") designed to teach React, TypeScript, and modern full-stack web development. It covers:

- **Frontend fundamentals**: HTML, CSS, JavaScript, TypeScript
- **React ecosystem**: Vite + React, Next.js 16, Remix / React Router 7
- **Full-stack patterns**: Express BFF, Vercel Serverless Functions
- **Deployment**: Render (Express), Vercel (Serverless)

Each chapter has a `主題.md` (topic file) with theory and a `examples/` or `ai_studio_專案來源/` directory with runnable code.

---

## Module System

All executable examples use **ES Module** (`import`/`export`), not CommonJS.

- **Browser examples**: `<script type="module" src="…">`
- **Node.js examples**: `"type": "module"` in `package.json`
- **Bundled projects** (Vite, Next.js, Remix): Native ES Module support

---

## Common Development Commands

### Vite Projects (05-React核心概念, Vite進階與優化, etc.)

```bash
cd <project-dir>
npm install
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript compilation + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Next.js Projects (07-Next.js/examples)

```bash
cd 07-Next.js/examples
npm install
npm run dev      # Start Next.js dev server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # ESLint check
```

### Remix / React Router Projects (06-remix/examples)

```bash
cd 06-remix/examples
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run typecheck # TypeScript type-checking
```

### Single-File Node Scripts (00-Node.js與npm, etc.)

```bash
node --input-type=module <file.js>  # Run with --input-type=module flag
# OR use: npm exec tsx <file.ts>    (if tsx is available)
```

---

## Project Structure

```
/
├── 00-HTML-CSS/                      # Static HTML/CSS (no JS)
├── 00-HTML-CSS-JavaScript/           # Static + vanilla JS
├── 00-HTML-CSS-Node-TypeScript/      # TypeScript → ES Module → browser
├── 00-HTML-TailwindCSS/              # Tailwind CSS via Play CDN (no build step)
├── 00-Node.js與npm/                  # Node.js basics, ESM modules
├── 01-環境建置/                      # Setup, npm, project structure
├── 02-Vite入門/                      # Vite fundamentals
├── 03-TypeScript配置/                # TypeScript config, type basics
├── 04-BFF與Express代理/             # Express BFF + Vite proxy setup
├── 05-React核心概念/examples/        # React hooks, state, props (single Vite project)
├── 05-Serverless-Vercel後端/         # Vercel CLI + Serverless Functions learning steps
├── 06-remix/examples/                # Remix / React Router 7 (single project)
├── 07-Next.js/examples/              # Next.js 16 + App Router (single project)
├── 08-TypeScript語法/                # TS advanced (types, generics)
├── 09-React/                         # React advanced (useRef, Context, etc.)
├── Vite進階與優化/                   # Vite config, aliases, env vars, splitting
├── BFF+Express_API_proxy/            # Complete BFF → Render deployment
├── Serverless_後端/                  # Complete Serverless → Vercel deployment
├── 10-Next.js-Vercel生態系與雲端服務整合/ # Route Handlers, Image, Edge, Blob, Redis (5 範例.md)
├── static-deploy-vercel/             # Static site deployment to Vercel walkthrough
├── Next.js_Vercel_雲端名片/          # Complete Next.js card app (practical project README)
└── github-docs-site/                 # GitHub Pages static hosting example
```

---

## Key Technology Stack

- **React**: 18.3+ / 19+ (Server + Client Components where applicable)
- **TypeScript**: 5.6+ (strict mode)
- **Vite**: 5.x / 7.x (bundler for React, Remix projects)
- **Next.js**: 16.x (App Router, Server Components)
- **Remix**: React Router 7.x (full-stack)
- **Express**: BFF pattern for API proxying
- **Tailwind CSS**: 4.x (utility-first styling)
- **ESLint**: 9.x (linting)
- **Node.js**: 18+ (module-aware)

---

## Deployment Patterns

### Path 1: Express BFF → Render

- Learn in: `04-BFF與Express代理/`
- Reference: `BFF+Express_API_proxy/README.md`
- Pattern: Vite frontend + Express backend + environment variables
- Protects API keys server-side

### Path 2: Vercel Serverless → Vercel

- Learn in: `05-Serverless-Vercel後端/`
- Reference: `Serverless_後端/README.md`
- Pattern: Vite frontend + Vercel Functions (no server maintenance)
- Faster setup for simple backends

---

## Working with Projects

### Running Tests

Each project directory structure varies; check the individual `package.json` or `主題.md` for test commands. Most educational examples do not include test suites—focus on manual verification in the browser or via `console.log`.

### Running a Single Vite Dev Server

```bash
cd 05-React核心概念/examples
npm run dev
# Dev server at http://localhost:5173
```

### Checking TypeScript Types

```bash
cd <project>
npx tsc --noEmit  # Check without emitting
```

### Linting Files

```bash
npm run lint
# Or lint a specific file:
npx eslint src/App.tsx
```

---

## Important Notes

1. **No root-level package.json**: Each project is independent. Install dependencies by entering the project directory and running `npm install`.

2. **Type Safety**: Projects use TypeScript in strict mode. Follow type annotations and avoid `any`.

3. **Environment Variables**: 
   - Vite: Use `.env` files and `import.meta.env`
   - Next.js: Use `.env.local` and `process.env`
   - Serverless: Use Vercel CLI `vercel env` or `.env.local`

4. **Module Resolution**: All examples use ES Module. Do not use `require()` or `module.exports`.

5. **Educational Focus**: These are teaching examples, not production applications. Prioritize clarity and understanding over optimization.

---

## Cursor Rules

A single rule exists at `.cursor/rules/proper-noun-annotation.mdc`: programming language proper nouns in Markdown should be annotated. (Minor style preference for Cursor IDE.)

---

## Quick Links

- **Main README**: Root `README.md` (index of all chapters)
- **Deployment Docs**:
  - BFF path: `BFF+Express_API_proxy/README.md`
  - Serverless path: `Serverless_後端/README.md`
- **Static Site Hosting**: `github-docs-site/README.md`
