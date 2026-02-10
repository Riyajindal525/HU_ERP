# Troubleshooting Guide

## Common Errors & Solutions

### 1. MongoDB Connection Error

**Error:**
```
MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```
or
```
MongoServerError: bad auth : authentication failed
```

**Solution:**
- Check your `.env` file has complete MongoDB URI with database name:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/haridwar-erp?retryWrites=true&w=majority
```

- For local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/haridwar-erp
```

**Fixed:** ✅ Updated your `.env` file with complete URI

---

### 2. Redis Connection Error

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:**
This is **not critical** - the server will run without Redis. But if you want Redis:

**Option 1: Install Redis locally**
```bash
# Windows (using Chocolatey)
choco install redis-64

# Or use Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

**Option 2: Disable Redis**
Comment out Redis in `.env`:
```env
# REDIS_URL=redis://localhost:6379
```

---

### 3. Module Not Found Error

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**Solution:**
```bash
cd backend
npm install
```

---

### 4. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or change port in `.env`:**
```env
PORT=5001
```

---

### 5. Mongoose Deprecated Warning

**Error:**
```
DeprecationWarning: Mongoose: `mongoose.Types.ObjectId()` is deprecated
```

**Solution:**
Use `new mongoose.Types.ObjectId()` instead

**Fixed:** ✅ Updated Attendance model

---

### 6. JWT Secret Not Defined

**Error:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
Make sure `.env` file exists in backend folder with:
```env
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

---

### 7. CORS Error (Frontend)

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Update `FRONTEND_URL` in backend `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Or allow all origins (development only):
```javascript
// In app.js
app.use(cors({
  origin: '*',
  credentials: true,
}));
```

---

### 8. Validation Error

**Error:**
```
ValidationError: Path `email` is required
```

**Solution:**
Check your request body matches the schema requirements. Use the API documentation in README.md

---

### 9. Cannot Start Server

**Error:**
```
Failed to start server: Error: ...
```

**Solution:**

1. Check MongoDB is running:
```bash
# For local MongoDB
mongosh
```

2. Check all environment variables are set:
```bash
# In backend folder
cat .env
```

3. Check for syntax errors:
```bash
npm run dev
```

---

## Quick Fixes Applied

✅ **Fixed MongoDB URI** - Added database name and query parameters
✅ **Fixed Mongoose deprecation** - Updated ObjectId constructor in Attendance model

---

## How to Start the Server

### Step 1: Start MongoDB
**Option A: Local MongoDB**
```bash
# Make sure MongoDB service is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Already configured in your `.env`
- No action needed

### Step 2: Start Redis (Optional)
```bash
# Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Or skip if you don't need caching
```

### Step 3: Install Dependencies
```bash
cd backend
npm install
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Verify Server is Running
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-08T...",
  "environment": "development"
}
```

---

## Debugging Tips

### 1. Check Logs
Logs are stored in `backend/logs/` folder:
- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

### 2. Enable Debug Mode
In `.env`:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

### 3. Test Database Connection
Create `backend/test-connection.js`:
```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });
```

Run:
```bash
node test-connection.js
```

### 4. Check Environment Variables
```bash
# Windows
echo %NODE_ENV%

# Or in Node.js
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

---

## Still Having Issues?

### Share These Details:

1. **Exact error message** from terminal
2. **When does it occur?**
   - During `npm install`
   - During `npm run dev`
   - When making API calls
3. **Your environment:**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - Operating System
4. **Logs from:**
   - Terminal output
   - `backend/logs/error-*.log`

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check for errors
npm run lint

# View logs
cat logs/application-*.log

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Environment Variables Checklist

Make sure your `.env` has all these:

- [ ] NODE_ENV
- [ ] PORT
- [ ] MONGODB_URI (with database name!)
- [ ] JWT_SECRET
- [ ] JWT_REFRESH_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] JWT_REFRESH_EXPIRES_IN
- [ ] FRONTEND_URL
- [ ] SMTP_HOST (for emails)
- [ ] SMTP_USER
- [ ] SMTP_PASS

---

## Success Indicators

When server starts successfully, you should see:
```
✅ MongoDB connected successfully
📊 Database: haridwar-erp
⚠️ Redis connection failed, running without caching (optional)
🚀 Server running on port 5000
📝 Environment: development
🌐 API: http://localhost:5000/api/v1
❤️  Health Check: http://localhost:5000/health
```
