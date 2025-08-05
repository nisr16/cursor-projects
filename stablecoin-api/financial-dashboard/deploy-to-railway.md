# 🚀 Deploy Dashboard to Railway

## Step-by-Step Guide

### Step 1: Go to Railway Dashboard
1. Open https://railway.app/dashboard
2. Sign in with your account (nschorr@gmail.com)
3. Select your project "nurturing-generosity"

### Step 2: Create New Service
1. Click "New Service" button
2. Select "GitHub Repo"
3. Choose your repository: `nisr16/stablecoin-banking-api`
4. Set the **Source Directory** to: `financial-dashboard`
5. Click "Deploy"

### Step 3: Configure the Service
Railway will automatically detect it's a Node.js app, but you can verify:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Port:** Railway will auto-detect

### Step 4: Get Your Public URL
Once deployed, Railway will provide a public URL like:
`https://your-dashboard-service.railway.app`

## Alternative: Quick Deploy with Vercel

If Railway doesn't work, use Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the dashboard directory
cd financial-dashboard
vercel

# Follow the prompts and get your URL!
```

## What Your Coworkers Will See

Once deployed, your coworkers can access:

- **Main Dashboard:** `https://your-url.railway.app/`
- **KPI Details:** `https://your-url.railway.app/kpi/totalrevenue`
- **Bank Profiles:** `https://your-url.railway.app/bank/Banco%20Industrial`
- **Transaction Details:** `https://your-url.railway.app/transaction/TXN-2024-001`

## Interactive Features Available

✅ **Clickable KPI Cards** - Click for detailed analytics
✅ **Clickable Bank Names** - Navigate to bank profiles
✅ **Clickable Transactions** - View detailed transaction info
✅ **Professional Design** - Fintech aesthetic
✅ **Responsive Layout** - Works on all devices
✅ **Real-time Data** - Live transaction feeds

## Share with Your Team

Once you have the public URL, share it with your coworkers and they can:

1. **Access from anywhere** - No need to be on your WiFi
2. **Use all interactive features** - Click KPI cards, bank names, transactions
3. **View on any device** - Desktop, tablet, mobile
4. **Navigate seamlessly** - Use browser back/forward buttons

## Troubleshooting

If deployment fails:
1. Check that `npm run build` works locally
2. Ensure all dependencies are in package.json
3. Verify the server.js file is present
4. Check Railway logs for specific errors

Your dashboard will be live and accessible to anyone with the URL! 🎉 