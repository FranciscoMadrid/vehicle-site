Flow Drive 🚗
Technical Assessment Project for PPF. A comprehensive fleet management system designed to register vehicles and track every entry and exit, ensuring data integrity and providing advanced filtering capabilities.

📋 Assessment Overview
This project was developed to satisfy the requirements of the PPF Web Developer technical test, which included:

Full CRUD functionality for vehicle management.
A robust Log System for vehicle entries and exits.
Advanced Data Filtering (Date, Driver, and Vehicle).
Integration of a React.js frontend with a Node.js/Express API

🏗 Architecture & Tech Stack
Frontend: Astro + React.js
UI Framework: PrimeReact (for high-quality, modern components)
Styling: Tailwind CSS v4
Backend: Node.js + Express.js
Database: Relational Database (Normalized schema for Vehicles and Logs)
Deployment: Hostinger (Frontend) & Private VPS (API)

🚀 Deployment Guide
Frontend Deployment
Environment Variables: Ensure your .env file points to your production API URL.

Build: Generate the static site locally:

Bash
npm run build
Upload: Transfer the contents of the dist/ folder to your web server (e.g., public_html).

## 🔑 Configuration (Environment Variables)

The frontend requires an environment variable to connect to the backend API. Create a `.env` file in the root directory:

```env
# Example for local development:
PUBLIC_API_BASE_URL=http://localhost:3000

# Example for production:
# PUBLIC_API_BASE_URL=[https://your-api-domain.com](https://your-api-domain.com)
