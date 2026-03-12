# React Router v7 範例專案

本專案為 [06-remix](../主題.md) 章節的範例，使用 **React Router v7**（整合 Remix）建立。

**學習方式**：依序完成 [範例 0](../範例0-建立專案.md)～[範例 5](../範例5-Action表單處理.md)。

## 專案結構對應

| 路徑 | 說明 |
|------|------|
| `app/routes/home.tsx` | 首頁，整合 [05-React核心概念](../../05-React核心概念/主題.md) 的互動範例（JSX、Props、State、useEffect、事件處理） |
| `app/examples/` | React 核心概念範例元件（與 05 章節一致） |
| `app/routes/about.tsx` | 關於頁（範例 3） |
| `app/routes/products.tsx` | 商品頁，Loader 資料載入（範例 4） |
| `app/routes/contact.tsx` | 聯絡頁，Action 表單處理（範例 5） |

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
