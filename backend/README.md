## ✅ `/backend/README.md`

```md
# ⚙️ Cyph Wallet Backend

This is the backend API server for the Cyph Wallet app, built using:

- Express.js
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- Multer for file uploads
- SIWE (Sign-In With Ethereum)

---

## 🧰 Features

- User + Wallet management
- REST API with validation
- Prisma for schema + DB management
- Multer file upload support
- Ready for production deployment

---

## 📦 Setup

### 1. Install dependencies

```bash
cd backend
npm install
````

### 2. Create `.env`

```env
DATABASE_URL="postgresql://wallet_user:securepassword@localhost:5432/wallet_db"
PORT=5000
```

### 3. Set up database

```sql
CREATE USER wallet_user WITH PASSWORD 'securepassword';
CREATE DATABASE wallet_db;
GRANT ALL PRIVILEGES ON DATABASE wallet_db TO wallet_user;
```

---

## 🚀 Development

### Run server

```bash
npm run dev
```

### Run migrations

```bash
npm run db:migrate
```

### Seed database (optional)

```bash
npm run seed
```

### View in Prisma Studio

```bash
npm run db:studio
```

---

## 📁 Structure

```
backend/
├── src/
│   ├── routes/
│   ├── lib/
│   ├── controllers/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

---

## 🧪 API Routes

| Method | Route        | Description                    |
| ------ | ------------ | ------------------------------ |
| POST   | /api/users   | Create or update a user wallet |
| GET    | /api/wallets | Get all wallets                |

---

## 📄 License

MIT © CypherVerse Labs
