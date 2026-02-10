# Quick Start Guide for Haridwar University ERP

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v18 or higher) - Run: `node --version`
- ✅ MongoDB (running on default port 27017)
- ✅ Redis (running on default port 6379)

## Step-by-Step Instructions

### 1. Install Backend Dependencies

Open a terminal/command prompt:

```bash
cd "d:\DeathNote\Hu ERP\backend"
npm install
```

Wait for installation to complete (may take 2-3 minutes).

### 2. Start Backend Server

In the same terminal:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Redis connected and ready
🚀 Server running on port 5000
```

### 3. Install Frontend Dependencies

Open a **NEW** terminal/command prompt:

```bash
cd "d:\DeathNote\Hu ERP\frontend"
npm install
```

Wait for installation to complete (may take 2-3 minutes).

### 4. Start Frontend Server

In the same terminal:

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 324 ms
➜  Local:   http://localhost:5173/
```

### 5. Open Browser

Visit: **http://localhost:5173/login**

## Demo Credentials

Try logging in with:
- **Email**: `student@demo.com`
- **Password**: `Student123`

Or click the "Student" quick access button on the login page.

## Troubleshooting

### MongoDB Not Running

**Windows** (if MongoDB is installed):
```bash
net start MongoDB
```

**Docker** (alternative):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Redis Not Running

**Docker** (easiest way):
```bash
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### Port Already in Use

If port 5000 or 5173 is in use:
1. Kill the process using that port
2. Or change the port in `.env` files

### Backend Won't Connect to MongoDB

1. Verify MongoDB is running: Open MongoDB Compass or run `mongosh`
2. Check the `MONGODB_URI` in `backend/.env`
3. Default is: `mongodb://localhost:27017/haridwar_erp`

## Alternative: Docker Compose (All-in-One)

If you have Docker installed:

```bash
cd "d:\DeathNote\Hu ERP"

# Create environment file
echo JWT_SECRET=haridwar-erp-secret-2026 > .env
echo JWT_REFRESH_SECRET=haridwar-erp-refresh-secret-2026 >> .env

# Start everything
docker-compose up
```

This will start MongoDB, Redis, Backend, and Frontend all together!

## Verify Everything is Working

1. **Backend Health**: http://localhost:5000/health
2. **Frontend**: http://localhost:5173
3. **Login Page**: http://localhost:5173/login

## Next Steps After Login

Depending on your role:
- **Students**: See dashboard with attendance, grades, schedule
- **Admins**: See system overview, manage students/faculty
- **Faculty**: Placeholder dashboard (to be implemented)

---

**Need Help?**
- Check the logs in `backend/logs/` directory
- Review `DEPLOYMENT.md` for detailed troubleshooting
- Ensure all prerequisites are installed and running
