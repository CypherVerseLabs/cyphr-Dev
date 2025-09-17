# 🪙 Wallet App – Full Stack Setup

A full-stack application to manage crypto wallets using:

- **Backend:** Express + Prisma + PostgreSQL
- **Frontend:** React + Wagmi + Vite

---

## 📁 Project Structure

wagmi-project/
├── backend/ ← Express + Prisma + PostgreSQL API
└── frontend/ ← React + Wagmi frontend

yaml
Copy code

---

## ✅ Prerequisites

Before starting, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- `npm` or `yarn` installed globally

---

## ⚙️ Setup Instructions

### 1. Install Node Dependencies

**Backend:**

```bash
cd backend
npm install
Frontend:

bash
Copy code
cd frontend
npm install
2. Set Up PostgreSQL
Run the following SQL commands (e.g., in psql, TablePlus, or pgAdmin):

sql
Copy code
CREATE USER wallet_user WITH PASSWORD 'securepassword';
CREATE DATABASE wallet_db;
GRANT ALL PRIVILEGES ON DATABASE wallet_db TO wallet_user;
3. Configure .env for Backend
Create a .env file in backend/ with the following:

env
Copy code
DATABASE_URL="postgresql://wallet_user:securepassword@localhost:5432/wallet_db"
PORT=5000
4. Run Prisma Migrations
bash
Copy code
# inside backend/
npx prisma migrate dev --name init
This creates your tables and generates the Prisma client.

5. Seed the Database (Optional)
bash
Copy code
npm run seed
This adds a default user (admin@example.com) and a wallet.

6. Run the App
Start Backend:

bash
Copy code
npm run dev
# Server will run at http://localhost:5000
Start Frontend:

bash
Copy code
cd ../frontend
npm run dev
# App will open at http://localhost:3000
📡 API Endpoints
Method	Endpoint	Description
POST	/api/users	Create or upsert a user wallet
GET	/api/wallets	Fetch all wallets + users

🧾 Scripts
Backend Scripts (from /backend):

bash
Copy code
npm run dev          # Start Express server with ts-node-dev
npm run build        # Compile to dist
npm run start        # Start compiled server
npm run db:migrate   # Run Prisma migration
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run seed         # Run seed script
Frontend Scripts (from /frontend):

bash
Copy code
npm run dev          # Start React dev server
npm run build        # Build frontend for production
🧩 Tech Stack
Backend
Express.js

Prisma ORM

PostgreSQL

CORS + Input Validation

REST API

Frontend
React (Vite)

Wagmi (Web3 Wallet Integration)

React Query

TailwindCSS (assumed from styling)

🧠 Tips
Make sure PostgreSQL is running before running backend

Use browser DevTools (network tab) to debug API calls

You can test backend endpoints using tools like Postman or cURL

Use Prisma Studio to view DB:

bash
Copy code
npm run db:studio
✅ Setup Checklist
Task	Status
PostgreSQL installed & running	✅
.env file created in backend	✅
Node modules installed	✅
Prisma migration run	✅
Seed script run (optional)	✅
Backend running on port 5000	✅
Frontend running on port 3000	✅
Wallet sync working via frontend	✅

📬 Author
Built by [CypherVerseLabs]
MIT License


🔁 Application Flow Diagram
+--------------------+             +--------------------------+
|  React Frontend    |             |       Express Backend    |
| (Vite + Wagmi +    |             |  (Node.js + Prisma)      |
|  TanStack Query)   |             |                          |
+--------------------+             +--------------------------+
        |                                     |
        | 1. User connects wallet (wagmi)     |
        |-----------------------------------> |
        |                                     |
        |                                     |
        |                                     |
        | 2. User enters email & selects type |
        |                                     |
        | 3. Clicks "Sync to Backend"         |
        |-----------------------------------> | 
        |                                     | 3a. /api/users (POST)
        |                                     |    → Create/update user
        |                                     |    → Create/update wallet
        |                                     |
        | <---------------------------------- |
        |        JSON: { user, wallet }       |
        |                                     |
        |                                     |
        | 4. React Query handles response     |
        |    ✅ Show success / ❌ error       |
        |                                     |

🔍 Component Responsibilities
🧩 Frontend
File	Responsibility
main.tsx	React app entry, wraps app in providers
CypherProvider.tsx	Sets up Wagmi + React Query context
App.tsx	Wallet connection UI, status, and login
WalletManager.tsx	Syncs wallet/email to backend
api.ts	Functions to call backend (createUserWallet, etc.)
🧩 Backend
File / Dir	Responsibility
index.ts	Main Express app setup and route wiring
routes/user.ts	Handles /api/users POST (create/update user + wallet)
routes/walletRoutes.ts	Handles /api/wallets GET (list wallets with users)
lib/prisma.ts	Prisma client instance
prisma/schema.prisma	DB schema
.env	PostgreSQL credentials
package.json	Scripts for dev, build, migrations
lib/seed.ts	Dev seed script to populate initial user
🔌 System Requirements to Run
✅ Frontend
# In frontend/
npm install
npm run dev


Requires Vite, Wagmi, TanStack Query

Connects to backend at http://localhost:5000/api (make sure ports match)

✅ Backend
# In backend/
npm install

# 1. Make sure PostgreSQL is running
# 2. Set up DB (if not done)
npm run db:migrate

# 3. Optionally seed
npx ts-node src/lib/seed.ts

# 4. Start backend
npm run dev

🌱 Optional Enhancements
Area	Suggestion
🔐 Validation	Already using express-validator, consider enforcing more strict input rules
🧪 Testing	Use Jest or Vitest for unit testing APIs and wallet logic
🚀 Deployment	Use Render
 or Railway
 for backend + Vercel
 or Netlify
 for frontend
⚙️ Dev Tools	Use Prisma Studio: npm run db:studio to inspect DB
💾 DB Backups	If going to production, setup daily Postgres backups (via Render or Supabase)

1. Prisma Relation Diagram

Here’s how your schema relations look, summarized in a diagram (text/ASCII) + notes, based on your models:

+----------------+           +-------------------+
|     User       | 1       * |     Wallet        |
|----------------|-----------|-------------------|
| id   (PK)      |           | id   (PK)         |
| email (unique) |           | address (unique)  |
| createdAt      |           | walletType        |
|                |           | label?            |
|                |           | chainId?          |
|                |           | userId (FK)       |
+----------------+           | createdAt         |
                             +-------------------+


User → Wallet is a one‑to‑many relation: one User can have multiple Wallets.

On the Wallet side, you have userId as a foreign key referencing User.id.

Prisma schema:

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  wallets   Wallet[]
  createdAt DateTime @default(now())
}

model Wallet {
  id         Int      @id @default(autoincrement())
  address    String   @unique
  walletType String
  label      String?
  chainId    Int?
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  createdAt  DateTime @default(now())
}