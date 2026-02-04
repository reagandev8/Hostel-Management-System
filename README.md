# Hostel Management System (Replica)

A modern, full-stack replica of the Hostel Management System, built with the MERN stack (well, Node/Express/React/Tailwind + JSON DB).

## Features
- **Modern Tech Stack**: React, Tailwind CSS, Node.js, Express.
- **Responsive UI**: Use of glassmorphism and modern typography.
- **Roles**: Student and Admin portals.
- **Database**: Simple JSON file database (`server/db.json`) for easy local setup without additional installations.

## Setup & Running

This project is divided into two parts: `client` (Frontend) and `server` (Backend). You need to run both concurrently.

### 1. Start the Backend Server
Open a terminal in the root directory:
```bash
cd server
npm start
```
The server will start on `http://localhost:5000` and create `db.json` automatically.
Default Admin: `admin` / `admin123`

### 2. Start the Frontend Client
Open a second terminal in the root directory:
```bash
cd client
npm run dev
```
The client will start (usually on `http://localhost:5173`). Open this URL in your browser.

## Project Structure
- `/client`: React frontend with Tailwind CSS.
- `/server`: Node.js Express backend with JSON database.
- `/server/db.json`: Local database file (created on first run).
