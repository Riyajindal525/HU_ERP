# Verification Steps for RBAC Implementation

## Pre-Verification Checklist

Before testing, ensure:
- [ ] MongoDB is running and accessible
- [ ] Backend `.env` file is configured
- [ ] Frontend `.env` file is configured
- [ ] All dependencies installed (`npm install` in both backend and frontend)

## Step-by-Step Verification

### 1. Start Backend Server
```bash
cd FinalErp/backend
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB connected successfully
```

**Check for errors:**
- No syntax errors in controllers
- No route registration errors
- All models loaded successfully

### 2. Start Frontend Server
```bash
cd 