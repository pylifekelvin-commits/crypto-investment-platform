#!/bin/bash

# CryptoVest Platform Deployment Script
echo "🚀 Deploying CryptoVest Platform to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in ./dist directory"
    echo "🌐 Ready for GitHub Pages deployment"
    
    # Optional: Copy CNAME file if you have a custom domain
    # echo "your-domain.com" > dist/CNAME
    
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to Settings > Pages in your GitHub repository"
    echo "3. Select 'GitHub Actions' as the source"
    echo "4. Your site will be available at: https://yourusername.github.io/your-repo-name/"
    echo ""
    echo "🎉 Deployment preparation complete!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi