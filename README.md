# 🖋️ Storiboard

> **Where imagination finds its voice.** A modern, premium blogging and story-sharing social platform built with Next.js 16, React 19, Tailwind CSS v4, and TanStack Query.

---

## 🌟 Overview

**Storiboard** is a fully-featured, highly interactive social blogging platform designed for dreamers, writers, and creators. It offers a beautiful, glassmorphic UI, rich interactive components, and real-time style actions designed to help users share their stories, fiction, memoirs, and ideas without limits.

Whether you're looking to publish rich stories, connect with an audience through a robust followers system, or discover trending ideas from the community, Storiboard provides a seamless, state-of-the-art blogging experience.

---

## ✨ Features

- 🔐 **Secure JWT-Based Authentication**: Seamless registration, login, and protected routing powered by `jose` and persistent client-side cookies.
- ✍️ **Advanced Rich Text Editors**: Draft beautiful stories using **TipTap** and **Quill** integration, supporting nested elements, rich formatting, and custom media.
- ⚡ **Dynamic Trending Feed**: Live feed utilizing infinite scroll pagination (via `@tanstack/react-query` and `react-intersection-observer`) with loading skeletons and end-of-feed markers.
- 💬 **Interactive Comments Sidebar**: Drop-in comment panel featuring real-time feedback, interactive replies, and fluid open/close animations.
- 🔖 **Post Bookmarking & Saving**: Seamless tabbed navigation between "Trending" feed and "Saved Posts" to bookmark posts for later reading.
- 🔔 **Interactive Notification Center**: Beautifully designed social post card styles featuring rich event logging (likes, comments, follows) built using custom Prisma schemas.
- 👥 **Followers System**: Seamlessly follow other creators, view profiles, and build a dedicated community of readers.
- 🌓 **Ambient Dark & Light Mode**: Sleek dark mode with colorful glassmorphic blur overlays, customized harmonies, and subtle micro-animations (via `tw-animate-css`).

---

## 🛠️ Technology Stack

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js 16 (App Router)** & **React 19** | Edge-ready server components and cutting-edge rendering. |
| **Styling & UI** | **Tailwind CSS v4** & **Radix UI** | Modern utility-first CSS styling paired with unstyled, accessible primitives. |
| **Icons & Visuals** | **Lucide React** | Sleek, clean SVG icons matching premium aesthetics. |
| **State & Data** | **TanStack Query (v5)** & **Axios** | High-performance asynchronous state synchronization and API fetching. |
| **Rich Editing** | **TipTap** & **Quill** | Fully customizable headless rich text editors. |
| **Media Uploads** | **Next-Cloudinary** | Fast, high-performance image uploads and CDN-based delivery. |
| **Authentication** | **Jose** & **Next-Client-Cookies** | Lightweight, browser-compatible JSON Web Token (JWT) handling and cookie storage. |
| **Form Control** | **React Hook Form** & **Zod** | Strictly-typed form states and schema-based runtime validation. |

---

## 📁 Directory Structure

```text
youtube/
├── app/                  # Next.js App Router root
│   ├── admin/            # Administrative dashboards
│   ├── auth/             # Login, Register, and recovery pages
│   │   ├── login/
│   │   └── register/
│   ├── home/             # Core application layout and feed views
│   │   ├── advanced-editor/ # Story publisher dashboard
│   │   ├── followers/       # Followers dashboard
│   │   ├── messages/        # Messaging inbox
│   │   ├── notifications/   # Real-time event log
│   │   ├── save-post/       # Bookmarked/saved stories
│   │   └── page.tsx         # Trending and saved feed page
│   ├── hooks/            # Directory-wide react hooks
│   ├── layout.tsx        # Base HTML layout and provider entrypoint
│   └── page.tsx          # Premium landing page / guest entry
├── components/           # Reusable UI React components
│   ├── ui/               # Lower-level components (Buttons, Inputs, etc.)
│   ├── bookmarkPost.tsx  # Bookmark state component
│   ├── comment-sidebar.tsx # Threaded side panel comments
│   ├── create-post.tsx   # Fast-composer feed utility
│   ├── home-navbar.tsx   # Authenticated persistent navigation bar
│   └── social-post-card.tsx # Premium post component with rich actions
├── providers/            # Shared React Contexts (AuthContext, ThemeProvider)
├── utils/                # API Client wrappers and custom helper utilities
│   ├── api/
│   │   ├── endpoints.ts  # TanStack query and Axios mutations / queries
│   │   └── validations.ts # Frontend schema validation logic
│   └── helpers.ts        # Helper constants and formatters
└── public/               # Static assets, fonts, and icons
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18.x or higher) and [npm](https://www.npmjs.com/) installed on your machine.

### ⚙️ Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/devmilon923/Resume-Builder-UI.git
   cd youtube
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and configure the environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Design & Aesthetic System

Storiboard utilizes a carefully curated color system and modern styling guidelines to offer a premium UI:

- **Premium Dark Mode**: High-contrast, deep-slate backgrounds with subtle pastel accents that reduce eye strain while retaining visual vibrance.
- **Glassmorphism**: Backdrop blur utility combined with border-opacity overlays (`backdrop-blur-sm bg-card/80 border-border/50`) to create floating UI panels.
- **Micro-Animations**: Hover animations on actionable items (`group-hover:scale-110 group-hover:rotate-3`) and sleek transitions to keep the application feeling responsive and alive.
- **Fluid Layouts**: Responsive grids and flexboxes configured via Tailwind CSS to ensure a native-like experience on desktop, tablet, and mobile browsers.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
