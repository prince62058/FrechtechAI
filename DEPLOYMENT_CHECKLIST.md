# Deployment Checklist for Render

## ✅ Pre-Deployment Setup Complete

### Files Configured
- [x] `render.yaml` - Render Blueprint configuration
- [x] `package.json` - Added Node.js 20.x engine specification
- [x] `.env.example` - Updated with MongoDB configuration
- [x] `.gitignore` - Configured to exclude sensitive files
- [x] Build scripts tested and working
- [x] TypeScript errors resolved

### Application Status
- [x] Server configured to listen on port 5000 (development) and dynamic port (production)
- [x] Vite configured with `allowedHosts: true` for proxied environments
- [x] Build process tested successfully (`npm run build`)
- [x] Application runs correctly in development (`npm run dev`)

## 📋 Deployment Steps

### Step 1: Set Up MongoDB Atlas (Free)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster:
   - Click "Build a Database"
   - Select "Shared" (Free tier - 512MB)
   - Choose your preferred region
3. Create database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Save username and password
4. Configure network access:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Get connection string:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/princetech-ai`

### Step 2: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key

### Step 3: Deploy to Render

#### Option A: Blueprint Deployment (Recommended)
1. Push code to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Blueprint"
4. Connect your repository
5. Render will detect `render.yaml`
6. Add environment variables:
   - `MONGODB_URI` = [Your MongoDB Atlas connection string]
   - `GEMINI_API_KEY` = [Your Gemini API key]
7. Click "Apply"

#### Option B: Manual Web Service
1. Push code to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: princetech-ai
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = [Your MongoDB Atlas connection string]
   - `GEMINI_API_KEY` = [Your Gemini API key]
   - `PORT` = `10000` (auto-assigned by Render)
7. Click "Create Web Service"

### Step 4: Verify Deployment

1. Wait for build to complete (5-10 minutes)
2. Visit your app URL: `https://[your-service-name].onrender.com`
3. Test key features:
   - [ ] Landing page loads
   - [ ] Sign up functionality works
   - [ ] Login functionality works
   - [ ] Search feature works
   - [ ] AI responses are generated

## 🚨 Important Notes

### Free Tier Limitations
- **Render Free Web Services**:
  - Spin down after 15 minutes of inactivity
  - ~30-60 seconds to wake up on first request
  - 750 hours/month free compute time

- **MongoDB Atlas Free Tier**:
  - 512 MB storage
  - Shared cluster
  - No expiration

### Environment Variables Required
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/princetech-ai
GEMINI_API_KEY=your_gemini_api_key_here
PORT=10000 (auto-assigned by Render)
```

### Troubleshooting

**Build Fails:**
- Check Node.js version (should be 20.x)
- Verify all dependencies are in package.json
- Check build logs for specific errors

**App Won't Start:**
- Verify environment variables are set
- Check MongoDB connection string format
- Ensure Gemini API key is valid

**Database Connection Errors:**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials
- Ensure database name is in connection string

**AI Features Not Working:**
- Verify Gemini API key is valid
- Check quota limits in Google AI Studio
- Review server logs for API errors

## 🔄 Updates & Maintenance

### Automatic Deployments
- Render auto-deploys on git push to main/master branch
- Or manually deploy: Dashboard → Service → "Manual Deploy"

### Monitoring
- View logs: Render Dashboard → Service → Logs
- Monitor performance: Render Dashboard → Service → Metrics
- Check MongoDB usage: Atlas Dashboard → Database

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

---

**Your deployment is ready! Follow these steps to get your app live on Render. 🚀**
