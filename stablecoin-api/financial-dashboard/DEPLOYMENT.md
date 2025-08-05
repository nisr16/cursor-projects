# 🚀 Dashboard Deployment Guide

## Quick Deployment Options for Sharing with Coworkers

### Option 1: Vercel (Recommended - Free & Fast)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Share the URL** with your coworkers instantly!

### Option 2: Netlify (Free & Easy)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy to Netlify:**
   ```bash
   netlify deploy --prod --dir=build
   ```

3. **Share the URL** with your coworkers!

### Option 3: GitHub Pages (Free)

1. **Add homepage to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/stablecoin-api"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

### Option 4: Local Network Sharing (Quick Test)

1. **Find your IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Start dashboard on your IP:**
   ```bash
   HOST=0.0.0.0 PORT=3001 npm start
   ```

3. **Share URL:** `http://YOUR_IP:3001`

### Option 5: Docker Container

1. **Create Dockerfile:**
   ```dockerfile
   FROM nginx:alpine
   COPY build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run:**
   ```bash
   docker build -t dashboard .
   docker run -p 8080:80 dashboard
   ```

3. **Share URL:** `http://localhost:8080`

## 🎯 Recommended Approach

### For Quick Sharing (Today):
**Use Vercel** - it's the fastest and most reliable:

```bash
# Install Vercel
npm install -g vercel

# Deploy (follow the prompts)
vercel

# Share the URL with coworkers!
```

### For Production Use:
**Use Netlify** with custom domain for professional deployment.

## 📋 Pre-Deployment Checklist

- ✅ Dashboard builds successfully
- ✅ All interactive features work
- ✅ TypeScript compilation passes
- ✅ Responsive design tested
- ✅ All routes functional

## 🔗 Sharing URLs

Once deployed, you can share these URLs with coworkers:

- **Main Dashboard:** `https://your-app.vercel.app`
- **KPI Details:** `https://your-app.vercel.app/kpi/totalrevenue`
- **Bank Profiles:** `https://your-app.vercel.app/bank/Banco%20Industrial`
- **Transaction Details:** `https://your-app.vercel.app/transaction/TXN-2024-001`

## 🚀 Quick Start Commands

```bash
# Build the project
npm run build

# Deploy to Vercel (easiest)
vercel

# Or deploy to Netlify
netlify deploy --prod --dir=build

# Share the URL with your team!
```

## 📊 Features Your Coworkers Will See

- **Interactive KPI Cards** - Click for detailed breakdowns
- **Clickable Bank Names** - Navigate to bank profiles
- **Clickable Transactions** - View detailed transaction info
- **Professional Design** - Fintech aesthetic
- **Responsive Layout** - Works on all devices
- **Real-time Data** - Live transaction feeds
- **Deep Linking** - Direct access to specific pages

## 🔧 Troubleshooting

If deployment fails:
1. Check that `npm run build` succeeds
2. Ensure all dependencies are installed
3. Verify TypeScript compilation passes
4. Check for any console errors

## 📞 Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- GitHub Pages: https://pages.github.com 