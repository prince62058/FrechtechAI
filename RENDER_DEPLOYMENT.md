# Deploy PrinceTech AI to Render

This guide will help you deploy your full-stack React + Express application to Render.

## Prerequisites

1. A GitHub/GitLab account with this repository
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
3. A [Google Gemini API key](https://aistudio.google.com/app/apikey)
4. A [Render](https://render.com) account (free tier)

## Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Click **"Build a Database"** → Select **"Shared"** (Free tier - 512MB)
3. Choose a cloud provider & region (preferably close to your Render app location)
4. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Set username and password (save these!)
5. Allow network access:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Get your connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `princetech-ai` or your preferred database name

## Step 2: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need it for Render)

## Step 3: Deploy to Render

### Option A: Using the Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub/GitLab repository
4. Configure the service:
   - **Name**: `princetech-ai` (or your preferred name)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `[your MongoDB Atlas connection string]`
   - `GEMINI_API_KEY` = `[your Gemini API key]`
   - `PORT` = `10000` (Render assigns this automatically)

6. Click **"Create Web Service"**

7. Wait for deployment to complete (5-10 minutes)

8. Your app will be live at: `https://princetech-ai.onrender.com`

### Option B: Using render.yaml (Automatic)

This repository includes a `render.yaml` file for automatic deployment:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your repository
4. Render will detect the `render.yaml` file
5. Add the required environment variables when prompted:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
6. Click **"Apply"**

## Step 4: Verify Deployment

1. Once deployed, visit your Render app URL
2. The app should load the landing page
3. Try creating an account and searching

## Important Notes

### Free Tier Limitations

- **Render Free Web Services**:
  - Spin down after 15 minutes of inactivity
  - Take 30-60 seconds to wake up on first request
  - 750 hours/month free compute time

- **MongoDB Atlas Free Tier**:
  - 512 MB storage
  - Shared cluster
  - No time limits (doesn't expire)

### Troubleshooting

**App won't start:**
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct

**Database connection errors:**
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check that database user credentials are correct
- Ensure database name is specified in connection string

**Gemini API errors:**
- Verify API key is valid
- Check Google AI Studio for quota limits
- Ensure API key has proper permissions

## Local Development

To run locally:

1. Copy `.env.example` to `.env`
2. Add your MongoDB URI and Gemini API key
3. Run `npm install`
4. Run `npm run dev`
5. Visit `http://localhost:5000`

## Updating Your Deployment

Render automatically redeploys when you push to your connected branch (usually `main` or `master`).

To manually redeploy:
1. Go to your Render service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain and follow DNS configuration instructions

---

**Your PrinceTech AI app is now live on Render! 🚀**
