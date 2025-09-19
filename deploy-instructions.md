# GitHub Deployment Instructions

## 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Crypto Vesting Platform MVP"
```

## 2. Connect to GitHub Repository
Replace `YOUR_USERNAME` with your actual GitHub username:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crypto-vesting-platform.git
git push -u origin main
```

## 3. Configure GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The deployment will automatically start

## 4. Access Your Live Site
After deployment (usually 2-5 minutes), your site will be available at:
`https://YOUR_USERNAME.github.io/crypto-vesting-platform/`

## Demo Accounts
- **Regular User**: demo@test.com / password123
- **Admin User**: admin@cryptovest.com / admin123

## Features Included
✅ Complete crypto vesting platform
✅ Video background with playable controls
✅ Authentication system
✅ Vesting & Staking investments
✅ Earning system (YouTube videos + social tasks)
✅ Admin panel with full control
✅ Responsive design with glassmorphism
✅ Real-time crypto price integration
✅ GitHub Pages deployment ready

## Troubleshooting
- If build fails, check the Actions tab for error details
- Make sure repository name matches the base path in vite.config.ts
- Ensure repository is public for free GitHub Pages