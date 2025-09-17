Wallet API Project

A wallet management system with a React frontend using Wagmi, and an Express backend using Prisma ORM with PostgreSQL.

Table of Contents

Project Overview

Tech Stack

Prerequisites

Setup Instructions

Backend Setup

Frontend Setup

Running the Application

API Endpoints

Project Structure

Project Overview

This project allows users to connect wallets via the frontend, and sync wallet data (with user emails and wallet types) to a backend API. The backend persists this data in a PostgreSQL database using Prisma as ORM.

Tech Stack

Backend: Node.js, Express, Prisma, PostgreSQL

Frontend: React, TypeScript, Wagmi, React Query

Database: PostgreSQL

Prerequisites

Node.js (v16+ recommended)

npm or yarn

PostgreSQL (running locally or accessible remotely)

Setup Instructions
Backend Setup

Clone the repo and navigate to the backend directory

cd backend


Install dependencies

npm install


Create the PostgreSQL database and user

Run psql or use your preferred PostgreSQL client and execute:

CREATE USER wallet_user WITH PASSWORD 'securepassword';
CREATE DATABASE wallet_db;
GRANT ALL PRIVILEGES ON DATABASE wallet_db TO wallet_user;


Configure environment variables

Create a .env file in the backend root with:

DATABASE_URL="postgresql://wallet_user:securepassword@localhost:5432/wallet_db"
PORT=5000


Run Prisma migrations

npx prisma migrate dev --name init


Start the backend server

npm run dev


The API server should now be running at http://localhost:5000.

Frontend Setup

Navigate to the frontend directory

cd frontend


Install dependencies

npm install


Configure API base URL

In your frontend src/api.ts file, ensure the API base URL points to your backend server:

const API_BASE_URL = 'http://localhost:5000/api';


Start the frontend development server

npm run dev


The frontend app will typically run at http://localhost:3000 or as configured.

Running the Application

Start PostgreSQL server (make sure it's running)

Start backend server (npm run dev inside backend/)

Start frontend server (npm run dev inside frontend/)

Open browser to frontend URL and connect your wallet

Use the UI to sync wallet info to backend

API Endpoints
Method	Endpoint	Description
POST	/api/users	Create or update user & wallet
GET	/api/wallets	Fetch all wallets with user data
Project Structure
wagmi-project/
├── backend/
│   ├── prisma/              # Prisma schema & migrations
│   ├── src/
│   │   ├── lib/prisma.ts    # Prisma client setup
│   │   ├── routes/          # Express routes (userRoutes.ts, walletRoutes.ts)
│   │   └── index.ts         # Express app entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api.ts           # API fetch functions
│   │   ├── components/      # React components (WalletManager.tsx)
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # React DOM & providers
│   ├── package.json
│   └── tsconfig.json
└── README.md