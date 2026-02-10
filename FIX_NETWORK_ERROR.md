# Network Error - Complete Fix

## What I Fixed

### 1. CORS Configuration (Backend)
- Changed CORS to allow ALL origins in development mode
- Added proper headers and methods
- Increased max age for preflight requests

### 2. API Service (Frontend)
- Added detailed logging for all requests/responses
- Added 10-second timeout
- Better error messages
- Shows exact URL being called

### 3. Environment Configuration
- Verified `.env` file exists and is correct

## How to Apply the Fix

### Step 1: Stop Everything
If backend or frontend is running, stop them (Ctrl+C)

### Step 2: Restart Backend
```cmd
cd FinalErp\backend
npm run dev
```

**Wait for this message:**
```
🚀 Server running on port 5000
🌐 API: http://localhost:5000/api/v1
```

### Step 3: Restart Frontend (NEW TERMINAL)
```cmd
cd FinalErp\frontend
npm run dev
```

**Wait for this message:**
```
  ➜  Local:   http://localhost:5173/
```

### Step 4: Clear Browser Cache
1. Open browser
2. Press `Ctrl+Shift+Delete`
3. Select "Cached images and files"
4. Click "Clear data"

### Step 5: Open Browser Console
1. Go to http://localhost:5173/login
2. Press `F12` to open Developer Tools
3. Click "Console" tab
4. Keep it open

### Step 6: Try to Login
1. Enter email: `rramteke2003@gmail.com`
2. Click "Send OTP"
3. **Watch the console** - you'll see:

**If working:**
```
🔧 API Configuration: { VITE_API_URL: "http://localhost:5000/api/v1", ... }
🔵 API Request: POST /auth/send-otp
🟢 API Response: /auth/send-otp 200
🔵 Sending OTP to: rramteke2003@gmail.com
🔵 OTP Response: { success: true, message: "..." }
```

**If still failing:**
```
🔴 API Error: { url: "/auth/send-otp", message: "Network Error", ... }
```

## What the Console Logs Mean

### 🔧 API Configuration
Shows the API URL being used. Should be: `http://localhost:5000/api/v1`

### 🔵 API Request
Shows outgoing request. Example: `POST /auth/send-otp`

### 🟢 API Response
Shows successful response with status code

### 🔴 API Error
Shows error details including:
- URL that failed
- HTTP method
- Status code (if any)
- Error message
- Response data (if any)

## Common Errors and Solutions

### Error: "Network Error" with no status code
**Cause**: Backend not running or wrong URL

**Solution**:
1. Check backend is running: `http://localhost:5000/health`
2. Check console shows correct API URL
3. Restart backend

### Error: "timeout of 10000ms exceeded"
**Cause**: Backend is slow or not responding

**Solution**:
1. Check backend terminal for errors
2. Restart backend
3. Check MongoDB connection

### Error: "CORS policy" or "blocked by CORS"
**Cause**: CORS not configured properly

**Solution**: Already fixed! Just restart backend.

### Error: Status 404
**Cause**: Wrong endpoint URL

**Solution**: Check console logs for the exact URL being called

### Error: Status 500
**Cause**: Backend error

**Solution**: Check backend terminal for error details

## Verification Steps

### 1. Test Backend Directly
```cmd
cd FinalErp
node test-connection.js
```

Should show:
```
✅ Health check passed
✅ API endpoint accessible
```

### 2. Test in Browser
Open: http://localhost:5000/health

Should show:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "environment": "development"
}
```

### 3. Check Frontend Config
Open browser console and look for:
```
🔧 API Configuration: { VITE_API_URL: "http://localhost:5000/api/v1", ... }
```

If `VITE_API_URL` is undefined, the `.env` file is not being loaded.

## If Still Not Working

### Check 1: Ports
Make sure nothing else is using ports 5000 or 5173:

```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

If something is using these ports, either:
- Stop that process
- Or change ports in `.env` files

### Check 2: Firewall
Windows Firewall might be blocking connections:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Make sure Node.js is allowed

### Check 3: Antivirus
Some antivirus software blocks localhost connections:
- Temporarily disable antivirus
- Try again
- If it works, add exception for Node.js

## Files Modified

1. `FinalErp/backend/src/app.js` - Fixed CORS configuration
2. `FinalErp/frontend/src/services/api.js` - Added logging and timeout
3. `FinalErp/frontend/src/hooks/useAuth.js` - Added debug logging (already done)

## Next Steps After Fix

Once you see the OTP request working in console:
1. Check backend terminal for the OTP
2. Enter the OTP in frontend
3. Login successfully

The OTP will look like:
```
##################################################
# LOGIN OTP for rramteke2003@gmail.com: 123456
##################################################
```
