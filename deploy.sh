#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Building portfolio for deployment..."

# Build the project
npm run build

echo "✅ Build complete!"
echo "📁 Built files are in the 'dist' directory"
echo ""
echo "🔧 Updated GitHub Actions workflow to use Vite's recommended deployment method"
echo ""
echo "📋 Deployment Steps:"
echo "1. Commit and push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix GitHub Pages deployment with updated workflow'"
echo "   git push origin main"
echo ""
echo "2. Configure GitHub Pages (if not done already):"
echo "   - Go to: https://github.com/yvesemmanuel/yvesemmanuel.github.io/settings/pages"
echo "   - Set Source to: 'GitHub Actions'"
echo "   - Save the settings"
echo ""
echo "3. Monitor deployment:"
echo "   - Check: https://github.com/yvesemmanuel/yvesemmanuel.github.io/actions"
echo "   - Wait for 'Deploy static content to Pages' workflow to complete"
echo ""
echo "🌐 Your site will be available at:"
echo "   - English: https://yvesemmanuel.github.io/#en"
echo "   - Portuguese: https://yvesemmanuel.github.io/#pt"
echo "   - Auto-detect: https://yvesemmanuel.github.io/"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If old site shows: Clear browser cache and wait 5-10 minutes"
echo "   - If workflow fails: Check Actions tab for error details"