# Event Manager Dashboard

A modern, full-stack application for managing events, built with Next.js, Express, and PostgreSQL. Designed with an "Editorial Minimalist" aesthetic.

## Features
- **Create/Edit/Delete Events:** Complete event management.
- **Browse Events:** Search by name/location, filter, and sort by date.
- **Registration:** Users can apply to attend an event.
- **Participant Management:** Event owners can view participants and cancel their registrations with a reason.
- **Form Validation:** Robust frontend validation using Zod and React Hook Form.

## Tech Stack
- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React.
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** PostgreSQL (using raw SQL queries via `pg`).

## Prerequisites
- Node.js (v18+)
- PostgreSQL Database

## Getting Started

### 1. Database Setup
1. Create a PostgreSQL database.
2. Run the initialization script provided in the backend to create tables:
   ```bash
   psql -U your_username -d your_database_name -f backend/init.sql
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string.
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000 by default.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Create a `.env.local` file if your backend runs on a different port:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on http://localhost:3000 by default.*

## Project Structure
- `/frontend`: Next.js application containing the UI and client-side logic.
- `/backend`: Express application handling the REST API and raw SQL queries.
  - `/backend/init.sql`: Database schema initialization.
