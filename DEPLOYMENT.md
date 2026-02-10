# 🚀 Haridwar University ERP - Quick Start Guide

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x
- Docker & Docker Compose (optional)

## 🏃 Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend will start on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

### 3. Verify Setup

- Backend health: http://localhost:5000/health
- Frontend: http://localhost:5173

## 🐳 Docker Deployment (Recommended)

### 1. Create environment file

```bash
# Create .env in root directory
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long
```

### 2. Start all services

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend on port 5000
- Frontend on port 5173

### 3. View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Stop services

```bash
docker-compose down

# With volumes (  deletes database)
docker-compose down -v
```

## 📝 Default Demo Credentials

### Student Login
- **Email**: student@demo.com
- **Password**: Student123

### Faculty Login
- **Email**: faculty@demo.com
- **Password**: Faculty123

### Admin Login
- **Email**: admin@demo.com
- **Password**: Admin123

> ⚠️ **Note**: These are demo credentials. You need to create actual users in the database.

## 🔧 Manual Database Setup

If not using Docker, ensure MongoDB and Redis are running:

### Start MongoDB
```bash
# Using MongoDB service
mongod --dbpath /path/to/data

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Start Redis
```bash
# Using Redis service
redis-server

# Or using Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

## 🗄️ Database Seeding (Optional)

To create sample data for testing:

```bash
cd backend
node scripts/seed.js  # You'll need to create this script
```

## 🌐 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/haridwar_erp
REDIS_URL=redis://localhost:6379

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@haridwaruniversity.edu

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Haridwar University ERP
```

## 🧪 Testing the API

Use Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Register a student
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@student.com",
    "password": "Test123456",
    "role": "STUDENT"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@student.com",
    "password": "Test123456"
  }'
```

## 📱 Accessing the Application

1. **Login Page**: http://localhost:5173/login
2. **Student Dashboard**: http://localhost:5173/student/dashboard
3. **Faculty Dashboard**: http://localhost:5173/faculty/dashboard
4. **Admin Dashboard**: http://localhost:5173/admin/dashboard

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default JWT secrets
- [ ] Update MongoDB credentials
- [ ] Configure SMTP for email notifications
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Configure rate limiting appropriately
- [ ] Review and update security headers
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

## 🐛 Troubleshooting

### Backend won't start

1. Check if MongoDB is running: `mongosh`
2. Check if Redis is running: `redis-cli ping`
3. Verify environment variables in `.env`
4. Check logs in `backend/logs/` directory

### Frontend can't connect to backend

1. Verify backend is running: `curl http://localhost:5000/health`
2. Check CORS configuration in backend
3. Verify `VITE_API_URL` in frontend `.env`

### Database connection failed

1. Ensure MongoDB is running on correct port
2. Check MongoDB URI format
3. Verify network connectivity

## 📊 Production Deployment

### Using Docker Compose (Production)

```bash
# Set environment to production
export NODE_ENV=production

# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Scale services if needed
docker-compose -f docker-compose.prod.yml up --scale backend=3 -d
```

### Manual Production Deployment

1. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve frontend with Nginx or any static server**

3. **Start backend with PM2**:
   ```bash
   cd backend
   npm install -g pm2
   pm2 start server.js --name "erp-backend" -i max
   pm2 save
   pm2 startup
   ```

## 🔄 Updates & Maintenance

### Update Dependencies

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

### Backup Database

```bash
# MongoDB backup
mongodump --db haridwar_erp --out /path/to/backup

# Restore
mongorestore --db haridwar_erp /path/to/backup/haridwar_erp
```

## 📚 API Documentation

API documentation will be available at:
- Development: http://localhost:5000/api/docs (if Swagger is configured)
- See `backend/README.md` for detailed API endpoints

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Contact the development team

---

**Happy Coding! 🎓**
