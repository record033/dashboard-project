# Fullstack Dashboard Application

A robust full-stack application featuring JWT authentication, Role-Based Access Control (RBAC), and a responsive dashboard. Built as a technical assignment implementation.

## 🛠 Tech Stack

**Backend:**

- **NestJS** - Progressive Node.js framework.
- **Prisma ORM** - Type-safe database client.
- **PostgreSQL** - Relational database.
- **JWT & Passport** - Secure authentication strategies (Access + Refresh tokens).

**Frontend:**

- **Next.js 14+** (App Router) - React framework for production.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **Axios** - HTTP client with interceptors for automatic token refreshing.

**DevOps:**

- **Docker & Docker Compose** - Containerization and orchestration.

---

## ✨ Features

- **Authentication:** Sign up, Sign in, and secure Logout.
- **Token Management:** Automatic Access Token rotation using Refresh Tokens (httpOnly cookies).
- **RBAC (Role-Based Access Control):**
    - **Admin:** Can manage users, view all records (with author attribution), and delete any content.
    - **User:** Can only create and manage their own records.
- **Dashboard:** Protected routes, responsive sidebar, and data tables.
- **CRUD Operations:** Full cycle for Records (Create, Read, Update, Delete).

---

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- Ports `3000`, `3001`, and `5432` must be available.

### Installation & Run

The entire application (Database + Backend + Frontend) is containerized. You don't need to install Node.js dependencies locally.

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd dashboard-project
    ```

2.  **Launch with Docker Compose:**

    ```bash
    docker compose up --build
    ```

    _Wait for the containers to build and start. The backend will automatically apply migrations and seed the database._

3.  **Access the Application:**
    Open your browser and navigate to:
    > **http://localhost:3001**

---

## 🔐 Credentials (Seed Data)

The application automatically creates two test accounts upon the first launch:

| Role      | Email               | Password   | Permissions                                    |
| :-------- | :------------------ | :--------- | :--------------------------------------------- |
| **Admin** | `admin@example.com` | `admin123` | Full access, User management, View all records |
| **User**  | `user@example.com`  | `user123`  | Manage own records only                        |

---

## 🧪 Suggested Testing Flow

To fully verify the functionality, follow these steps:

1.  **Admin Login:**
    - Go to `http://localhost:3001`.
    - Log in with the **Admin** credentials above.
    - You will be redirected to the Dashboard.

2.  **User Management:**
    - Navigate to the **"Users"** tab.
    - Observe the list of registered users.
    - Try changing a user's role (click the role badge) or deleting a user.

3.  **Record Management (Admin View):**
    - Navigate to **"My Records"**.
    - As an Admin, you will see records from **all users**.
    - Notice the "Author" badge on records created by others.
    - Click on a record title to view details.
    - Try deleting a record.

4.  **User Perspective:**
    - Click **"Log out"** in the sidebar.
    - Log in with the **User** credentials or register a new account.
    - Navigate to **"Users"** — you should see an "Access Denied" message or be redirected, as this page is protected.
    - Navigate to **"My Records"** — create a new note. You will only see your own records here.

5.  **Persistence & Tokens:**
    - Reload the page to verify the session persists.
    - (Optional) Clear the `Authentication` header in dev tools to test the silent refresh mechanism via cookies.
