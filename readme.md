# Water Intake Tracker — Frontend Application

A premium, modern React application built with Vite, Tailwind CSS, Axios, and React Router. It serves as a visual water hydration tracker allowing users to log their intake goals, track consumption histories, and manage users as administrators.

---

## Technical Stack

- **Core**: React 18, Vite
- **Styling**: Tailwind CSS (featuring animated SVG waves and glassy dark-mode panels)
- **Routing**: React Router DOM (v6)
- **API Client**: Axios (with credentials interceptors for Bearer Token injection)

---

## Getting Started

Follow these steps to run the frontend application locally:

### 1. Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).
- Ensure the backend server is running locally (by default at `http://localhost:5000`).

### 2. Install Dependencies

In the root of the frontend project directory, run:

```bash
npm install
```

### 3. Environment Variables Configuration

Copy the example environment configuration file to create your local `.env`:

```bash
cp .env.example .env
```

Open `.env` and verify the backend API endpoint URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run Development Server

Launch the Vite local development server:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173/`

---

## Route & Page Configurations

| Path | Component / Page | Authentication | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | Register | Public | Guest (unauthenticated) | Account creation form |
| `/login` | Login | Public | Guest (unauthenticated) | Authenticate user credentials |
| `/dashboard` | Dashboard | Protected | standard / admin | Circle wave visual tracker, quick-add logging controls, list of today's individual logs, and delete options |
| `/history` | History | Protected | standard / admin | Grouped daily intake log progress bars |
| `/admin/users` | AdminUsers | Protected | **admin** | User grid search directory showing user cards, target goals, role badges, and delete account triggers |
| `/admin/users/:id` | AdminUserHistory | Protected | **admin** | Inspected user summary, daily goal inline editor, history logs listings, and daily log deletions |

---

## Key Features Implemented

1. **Circular Wave Progress Bubbles**: Dynamic SVG wave fill transitioning using height percentages matching hydration records relative to goals.
2. **Backend-Sourced Entries List**: The Dashboard's individual logs list is backed entirely by the database summary endpoint, ensuring persistence across browser sessions.
3. **Roles Shield Protection**: Route wrapper blocks protect guest views from logged-in members, redirect unauthenticated users to `/login`, and restrict administrative URLs `/admin/*` exclusively to admins.
4. **Interactive Action Dialog Modals**: Warning overlay confirmations replace standard browser dialog boxes with elegant, theme-compliant modals.
