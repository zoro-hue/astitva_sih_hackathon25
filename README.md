🚆 Railway Management System

A fullstack Railway Management System built with Next.js, TypeScript, Tailwind CSS, ShadCN, Supabase, and Groq AI APIs.
This system manages train schedules, ticket booking, passenger info, and predictive analytics (like delay prediction & maintenance alerts).

✨ Features

🔐 Authentication – Secure login & role-based access.

🎟 Ticket Booking – Online reservation, cancellation, and seat availability.

🚉 Train Management – Schedules, live status, routes.

🛠 Predictive Maintenance – AI-driven alerts for train/track issues (via Groq).

⏱ Delay Prediction – ML-powered real-time delay forecasting.

📊 Admin Dashboard – Analytics for operations, revenue, and performance.

🏗 Tech Stack

Frontend: Next.js
 + TypeScript

UI: Tailwind CSS
 + ShadCN UI

Backend: Next.js API Routes

Database: Supabase
 (Postgres)

AI/ML APIs: Groq
 for predictive analytics

Package Manager: pnpm

🚀 Getting Started
1. Clone the Repository
git clone https://github.com/your-username/railway-management-system.git
cd railway-management-system

2. Install Dependencies
pnpm install

3. Set Environment Variables

Create a .env.local file in the root:

NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>
GROQ_API_KEY=<your_groq_api_key>

4. Run Locally
pnpm dev


Visit: http://localhost:3000

5. Build for Production
pnpm build
pnpm start

🌍 Deployment

Recommended platforms:

Vercel
 → Best for Next.js (SSR, API routes).

Render
 → Full backend + DB support.

Docker
 → For cloud VM deployment.

Set the same environment variables in your hosting platform.

🎯 Target Users

Passengers: Check schedules, book/cancel tickets, track trains.

Operations Dept.: Monitor train movement, delays.

Maintenance Dept.: Predictive maintenance alerts.

Admin Staff: Analytics dashboard, performance monitoring.

📂 Project Structure
.
├── app/                # Next.js App Router (pages, layouts, routes)
├── components/         # UI components (ShadCN + custom)
├── hooks/              # Custom React hooks
├── lib/                # API clients, DB connections, AI integrations
├── public/             # Static assets
├── styles/             # Global styles
├── .env.local          # Environment variables
└── package.json

🤝 Contributing

Fork the repo

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Added feature"

Push branch: git push origin feature-name

Open a Pull Request
