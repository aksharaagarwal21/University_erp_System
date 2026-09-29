# University ERP System

A university management system with separate student and faculty portals, built as a Database Management Systems (21CSC205P) mini project.

## Features

- **Student portal:** profile, enrolled courses, timetable, attendance, marks, results and fees
- **Faculty portal:** subjects, timetable, attendance marking (single and bulk), component marks, leave requests, announcements and study materials
- **Admin pages:** manage students, faculty, departments, courses, subjects, enrollments and exams
- **Reports:** enrollment statistics, grade distribution and top performers, built on SQL views
- Read-only SQL console for running `SELECT` queries against the database

## Database

The `database/` folder contains the MySQL scripts, meant to be run in order:

| Script | Contents |
|---|---|
| `01_create_database.sql` | Tables and sample data |
| `02_constraints_aggregates.sql` | Constraints and aggregate queries |
| `03_views_triggers_cursors.sql` | Views, triggers and cursors |
| `04_transactions_concurrency.sql` | Transactions and concurrency control |
| `05_auth_users.sql` | Login accounts |
| `06_enhanced_tables.sql` | Attendance, fees, announcements and other portal tables |
| `07_comprehensive_data.sql` | Additional sample data |

## Tech stack

React · Vite · Recharts · Node.js · Express · MySQL

## Run locally

1. Run the SQL scripts in `database/` on MySQL 8, in order.
2. Start the API (runs on port 5000):

   ```bash
   cd backend
   npm install
   # set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME and DB_PORT as environment variables
   npm start
   ```

3. Start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend calls `http://localhost:5000/api` by default. Set `VITE_API_URL` to use a different API.
