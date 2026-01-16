# TaskFlow - Collaborative Task Manager

**TaskFlow** is a modern, full-stack collaborative task management application designed for real-time team productivity. It features instant updates, live analytics, and a seamless user experience wrapped in a premium dark-mode UI.

---

## 🚀 Key Features

*   **Real-time Collaboration**: Instant updates for task assignments, status changes, and deletions using **Socket.io**.
*   **Live Notifications**: Real-time alert system for assigned tasks and updates.
*   **Interactive Dashboard**:
    *   Visual Analytics with **Recharts** (Task distribution, status breakdown).
    *   Filtering & Sorting (By Priority, Status, Due Date).
*   **Secure Authentication**: JWT-based authentication with secure cookie handling.
*   **Modern UI/UX**:
    *   Built with **Next.js 15 (App Router)** and **React 19**.
    *   Styled with **Tailwind CSS 4** for a responsive, dark-mode-first design.
    *   Smooth transitions and micro-interactions.

---

## 🛠️ Technology Stack

### Frontend (Client)
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **UI Library**: React 19
*   **Styling**: Tailwind CSS 4 & Lucide React (Icons)
*   **State Management**: TanStack Query (React Query)
*   **Real-time**: Socket.io Client
*   **Forms**: React Hook Form + Zod Validation
*   **Utilities**: date-fns, clsx, tailwind-merge

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js 5
*   **Database**: PostgreSQL (via Neon / Local)
*   **ORM**: Prisma (w/ @prisma/adapter-pg)
*   **Real-time**: Socket.io
*   **Authentication**: JWT (JSON Web Tokens) & Bcrypt
*   **Security**: Helmet, CORS

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v20 or higher)
*   PostgreSQL Database URL (Local or Remote like Neon.tech)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/taskflow.git
    cd task-manager
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in `server/` with the following:
        ```env
        PORT=3000
        DATABASE_URL="postgresql://user:password@host:port/dbname"
        JWT_SECRET="your_super_secret_key"
        CLIENT_URL="http://localhost:5173"
        ```
    *   Run Database Migrations:
        ```bash
        npx prisma generate
        npx prisma migrate dev --name init
        ```
    *   Start Backend:
        ```bash
        npm run dev
        ```

3.  **Client Setup**
    ```bash
    cd ../client
    npm install
    ```
    *   Create a `.env` file in `client/` with:
        ```env
        NEXT_PUBLIC_API_URL="http://localhost:3000/api"
        ```
    *   Start Frontend:
        ```bash
        npm run dev
        ```

4.  **Access the App**
    *   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
Task-Manager/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router Pages
│   │   ├── components/     # Reusable UI Components
│   │   ├── context/        # Auth & Notification Contexts
│   │   ├── hooks/          # Custom Hooks (useSocket, etc.)
│   │   └── utils/          # API & Helpers
│   └── ...
├── server/                 # Express Backend
│   ├── prisma/             # Database Schema
│   ├── src/
│   │   ├── controllers/    # Route Logic
│   │   ├── middlewares/    # Auth & Error Handling
│   │   ├── routes/         # API Routes
│   │   └── server.ts       # Entry Point
│   └── ...
└── README.md
```


This project is open-source and available under the [MIT License](LICENSE).