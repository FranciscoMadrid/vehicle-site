Flow Drive 🚗
A modern vehicle management dashboard. This project is a split-stack application using a static frontend and a separate VPS-hosted API.

🏗 Architecture
Frontend: Astro (Static Mode) + React

UI Components: PrimeReact + Tailwind CSS v4

Backend: Express.js (Node.js) on a Linux VPS

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
