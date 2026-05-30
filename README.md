# 🖋️ Storiboard

> **Where imagination finds its voice.** A modern, premium blogging and story-sharing social platform built with Next.js 16, React 19, Tailwind CSS v4, and TanStack Query.

---

## 🌟 Overview

**Storiboard** is a fully-featured, highly interactive social blogging platform designed for dreamers, writers, and creators. It offers a beautiful, glassmorphic UI, rich interactive components, and real-time style actions designed to help users share their stories, fiction, memoirs, and ideas without limits.

Whether you're looking to publish rich stories, connect with an audience through a robust followers system, or discover trending ideas from the community, Storiboard provides a seamless, state-of-the-art blogging experience.

---

## 📁 Directory Structure

```text
storeboard/
├── 📄 Configuration Files
│   ├── components.json           # shadcn/ui components configuration
│   ├── eslint.config.mjs         # ESLint rules and configurations
│   ├── next.config.ts            # Next.js configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── postcss.config.mjs         # PostCSS plugins (Tailwind)
│   └── package.json              # Dependencies and scripts
│
├── 📁 app/                       # Next.js App Router (File-based routing)
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── layout.tsx                # Root HTML layout and provider entrypoint
│   ├── page.tsx                  # Premium landing page / guest entry
│   │
│   ├── 📁 admin/
│   │   ├── layout.tsx            # Admin section layout
│   │   └── page.tsx              # Administrative dashboards
│   │
│   ├── 📁 auth/                  # Authentication pages
│   │   ├── 📁 login/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          # User login interface
│   │   └── 📁 register/
│   │       ├── layout.tsx
│   │       └── page.tsx          # User registration with OTP verification
│   │
│   ├── 📁 home/                  # Core application - Authenticated user area
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main trending and saved feed
│   │   │
│   │   ├── 📁 advanced-editor/   # Rich story publishing dashboard
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 followers/         # Followers discovery and management
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 messages/          # User messaging inbox
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 notifications/     # Real-time event log and alerts
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 profile/           # User profile management
│   │   │   ├── page.tsx          # View profile
│   │   │   └── 📁 edit/
│   │   │       ├── page.tsx      # Edit profile form
│   │   │       └── validation.ts # Zod validation schema for profile
│   │   │
│   │   └── 📁 save-post/         # Bookmarked and saved stories
│   │       ├── layout.tsx
│   │       └── page.tsx
│   │
│   ├── 📁 project/               # Project showcase page
│   │   └── page.tsx
│   │
│   └── 📁 hooks/                 # App-wide React hooks
│       └── debounce.ts           # Debounce hook for search & input
│
├── 📁 components/                # Reusable React UI components
│   ├── bookmarkPost.tsx          # Post bookmark state management
│   ├── comment-sidebar.tsx       # Threaded comment panel with infinite pagination
│   ├── create-post.tsx           # Fast-composer for new posts
│   ├── home-navbar.tsx           # Authenticated persistent navigation bar
│   ├── social-post-card.tsx      # Premium post card with likes, comments, shares
│   │
│   └── 📁 ui/                    # shadcn/ui primitive components
│       ├── avatar.tsx            # User avatar component
│       ├── badge.tsx             # Badge labels
│       ├── button.tsx            # Reusable button component
│       ├── card.tsx              # Card container
│       ├── checkbox.tsx          # Checkbox input
│       ├── dialog.tsx            # Modal dialog
│       ├── field.tsx             # Form field wrapper
│       ├── input-group.tsx       # Grouped input controls
│       ├── input-otp.tsx         # OTP input field
│       ├── input.tsx             # Standard input field
│       ├── label.tsx             # Form label
│       ├── navbar.tsx            # Navigation bar
│       ├── scroll-area.tsx       # Scrollable area
│       ├── select.tsx            # Dropdown select
│       ├── separator.tsx         # Visual divider
│       ├── tabs.tsx              # Tabbed interface
│       └── textarea.tsx          # Multiline text area
│
├── 📁 providers/                 # React Context & Providers
│   ├── AuthContext.tsx           # User authentication state & profile
│   ├── ProtectAdmin.tsx          # Admin-only route protection
│   ├── ProtectGest.tsx           # Guest-only route protection (non-auth)
│   ├── ProtectUser.tsx           # Authenticated user route protection
│   ├── QueryClient.tsx           # TanStack Query client provider
│   └── RouteValidation.tsx       # Route validation and permission checks
│
├── 📁 lib/
│   └── utils.ts                  # Utility functions (cn for Tailwind merging)
│
├── 📁 utils/                     # API & helper utilities
│   ├── helpers.ts                # Helper constants, formatters, and utilities
│   │
│   └── 📁 api/
│       ├── endpoints.ts          # TanStack Query hooks and Axios API calls
│       │                         # Includes mutations for posts, comments, likes
│       │                         # Includes queries for feed, followers, notifications
│       └── validations.ts        # Zod schemas for frontend form validation
│
├── 📁 public/                    # Static assets
│   ├── images/                   # Optimized images and illustrations
│   ├── icons/                    # SVG icons and icon sets
│   └── fonts/                    # Custom web fonts
│
└── 📄 Documentation
    └── README.md                 # Project documentation
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

## ✨ Key Features & Highlights

### 🔐 Advanced Authentication with OTP Hashing

- **Secure OTP Verification**: Implements 5-digit OTP validation during user registration for enhanced security
- **Backend OTP Hashing**: OTPs are cryptographically hashed using industry-standard algorithms (likely bcrypt or similar) before storage
- **Token-Based Session Management**: Uses JWT tokens with automatic refresh mechanisms via `renewToken` endpoints
- **Multi-Layer Security**: Integrates role-based access control (Admin, User, Moderator) with protected routes

### 📊 Intelligent Feed Algorithm

- **Cursor-Based Pagination**: Implements efficient cursor pagination for infinite scrolling with `limit` and `pc` (page cursor) parameters
- **Trending Feed System**: Curated "Trending" tab that surfaces popular posts based on engagement metrics (likes, comments, shares)
- **Saved Posts Management**: Dedicated "Save Post" tab for bookmarked content with separate API endpoints (`/post/bookmarks/`)
- **Read Time Estimation**: Automatically calculates and displays estimated reading time for each post (default 200 words/minute)
- **Real-time Feed Updates**: TanStack Query manages cache invalidation for instant post creation and bookmark updates

### 💬 Post with Nested Threaded Comments

- **Multi-Level Comment System**: Full support for main comments and nested replies (up to N-levels)
- **Threaded Reply Architecture**: Replies are linked to parent comments via `sourceId` and `commentType` ("post" | "replie")
- **Infinite Comment Pagination**: Each comment thread supports infinite pagination through `useGetAllComments` and `useGetAllReplie` hooks
- **Interactive Comment Sidebar**: Dedicated comment panel displaying entire conversation thread with real-time updates
- **Comment Actions**: Like, reply, and delete functionality on each comment with optimistic UI updates

### 🗄️ Prisma with PostgreSQL

- **Type-Safe Database ORM**: Prisma ORM for fully type-safe database operations and migrations
- **PostgreSQL Integration**: Production-grade relational database with ACID compliance
- **Auto-Generated Migrations**: Schema versioning through Prisma Migrate for collaborative development
- **Optimized Queries**: Efficient data fetching with relation loading and selective field queries
- **Scalable Architecture**: Ready for deployment on cloud platforms like Vercel, Railway, or AWS

### 🎨 Clean & Premium UI System

#### **Glassmorphism Design**

- Backdrop blur utility combined with border-opacity overlays (`backdrop-blur-sm bg-card/80 border-border/50`) for floating UI panels
- Semi-transparent components with visual depth and modern aesthetic

#### **Color & Typography**

- **Premium Dark Mode**: High-contrast, deep-slate backgrounds with subtle pastel accents that reduce eye strain while retaining visual vibrance
- **Consistent Design System**: Tailwind CSS v4 with custom color tokens for cohesive branding
- **Readable Typography**: Optimized font sizes and line-height ratios for comfortable reading

#### **Micro-Interactions**

- Smooth hover animations on actionable items (`group-hover:scale-110 group-hover:rotate-3`)
- Sleek transitions and fade-in animations (`animate-in fade-in slide-in-from-bottom-4`)
- Loading states with spinning loaders for async operations

#### **Responsive Layout**

- Flexible grids and flexbox layouts that adapt to desktop, tablet, and mobile
- Native-like experience with proper spacing and touch-friendly buttons
- Persistent navigation bar with contextual menu items

### 🚀 Advanced Frontend Stack

- **React 19**: Latest React features with server and client components
- **Next.js 16**: App Router for modern file-based routing and API routes
- **TanStack Query**: Powerful data fetching, caching, and synchronization
- **Tailwind CSS v4**: Utility-first CSS with advanced features and plugins
- **React Hook Form**: Performant form handling with validation
- **Zod**: Type-safe schema validation for both frontend and backend
- **Lucide React**: Consistent icon library throughout the application
- **Sonner**: Beautiful toast notifications for user feedback
- **Tiptap Editor**: Rich text editor for composing stories with markdown support

### 👥 Social Features

- **Follow System**: Track and manage followers with dedicated followers dashboard
- **Like & Bookmark**: Interactive post engagement with persistent bookmarks
- **Real-time Notifications**: Event log system for user interactions and updates
- **User Profiles**: Comprehensive profiles with bio, website, address, and profession
- **Advanced Search & Filtering**: Search by profession, with infinite pagination

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
