# React Router v7 範例專案

本專案為 [06-remix](../主題.md) 章節的範例，使用 **React Router v7**（整合 Remix）建立。

## 學習方式

本 `examples` 資料夾為**最原始的基本 template**。請依序完成 [範例 0](../範例0-建立專案.md)～[範例 5](../範例5-Action表單處理.md)，依照教學**逐步修改**此專案：

| 範例 | 修改內容 |
|------|----------|
| 範例 0 | 建立專案（或使用本資料夾作為起點） |
| 範例 2 | 認識專案結構 |
| 範例 3 | 新增 About 頁面、修改 routes.ts、root.tsx |
| 範例 4 | 新增 Products 頁面（Loader）、修改 routes.ts、root.tsx |
| 範例 5 | 新增 Contact 頁面（Action）、修改 routes.ts、root.tsx |

---

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
