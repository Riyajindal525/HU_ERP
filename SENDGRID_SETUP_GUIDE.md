# SendGrid Setup Guide for OTP Email

## Step 1: Create SendGrid Account

1. Go to https://sendgrid.com/
2. Click "Start for Free" or "Sign Up"
3. Fill in your details:
   - Email: Use your email (e.g., milanchauhan0987@gmail.com)
   - Password: Create a strong password
   - Complete the registration

## Step 2: Verify Your Email

1. Check your email inbox for SendGrid verification email
2. Click the verification link
3. Complete the account setup

## Step 3: Create API Key

1. Log in to SendGrid dashboard: https://app.sendgrid.com/
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"** button
4. Configure:
   - **API Key Name**: `Haridwar-ERP-Production` (or any name)
   - **API Key Permissions**: Select **"Full Access"** (or "Restricted Access" with Mail Send permission)
5. Click **"Create & View"**
6. **IMPORTANT**: Copy the API key immediately (you won't see it again!)
   - It looks like: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

## Step 4: Verify Sender Email

SendGrid requires you to verify the email address you'll send from:

### Option A: Single Sender Verification (Easiest for testing)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name**: Haridwar University ERP
   - **From Email Address**: milanchauhan0987@gmail.com (or your domain email)
   - **Reply To**: Same as above
   - **Company Address**: Your address
   - **City, State, Zip, Country**: Your location
4. Click **"Create"**
5. Check your email for verification link
6. Click the verification link

### Option B: Domain Authentication (Better for production)

1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow the DNS setup instructions
4. This requires access to your domain's DNS settings

## Step 5: Update Backend .env File

Once you have your API key and verified sender email, update `backend/.env`:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=milanchauhan0987@gmail.com
```

**Replace**:
- `SG.your-actual-api-key-here` with your actual SendGrid API key
- `milanchauhan0987@gmail.com` with your verified sender email

## Step 6: Test the Setup

1. Save the `.env` file
2. Restart your backend server:
   ```bash
   cd backend
   npm start
   ```
3. Try to login with OTP
4. Check your email inbox for the OTP

## Troubleshooting

### Error: "The from address does not match a verified Sender Identity"
- **Solution**: Make sure you verified the sender email in Step 4
- The email in `SENDGRID_FROM_EMAIL` must exactly match the verified sender

### Error: "Unauthorized"
- **Solution**: Check your API key is correct
- Make sure you copied the entire key including `SG.` prefix

### Error: "Permission denied"
- **Solution**: Recreate the API key with "Full Access" or ensure "Mail Send" permission is enabled

### OTP still showing in terminal
- **Solution**: Check backend terminal for SendGrid error messages
- Make sure you restarted the backend after updating `.env`

## SendGrid Free Tier Limits

- **100 emails per day** for free
- Perfect for development and testing
- Upgrade to paid plan for production use

## Important Notes

1. **Never commit your API key to Git** - it's already in `.env` which is in `.gitignore`
2. **Keep your API key secret** - treat it like a password
3. **Use environment variables** - never hardcode the API key in your code
4. **Verify sender email** - SendGrid won't send emails from unverified addresses

## Quick Setup Commands

After getting your API key and verifying sender:

```bash
# Edit .env file
notepad backend\.env

# Add these lines (replace with your actual values):
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com

# Restart backend
cd backend
npm start
```

## Need Help?

- SendGrid Documentation: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/
- API Key Guide: https://docs.sendgrid.com/ui/account-and-settings/api-keys
