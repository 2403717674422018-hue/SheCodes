#!/bin/bash

# TeacherLoggg - GitHub Push Script
# Configured for: 2403717674422018-hue/teacherlog_tracker

echo "🚀 TeacherLoggg GitHub Push"
echo "============================"
echo ""

GITHUB_USERNAME="2403717674422018-hue"
REPO_NAME="teacherlog_tracker"
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "📋 Configuration:"
echo "  GitHub Username: $GITHUB_USERNAME"
echo "  Repository Name: $REPO_NAME"
echo "  GitHub URL: $GITHUB_URL"
echo ""

cd /app

echo "🚀 Pushing to GitHub..."
echo "   (You may be asked for GitHub credentials)"
echo ""
echo "⚠️  Important: When prompted for password,"
echo "    use a Personal Access Token, NOT your GitHub password!"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/2403717674422018-hue/teacherlog_tracker"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Go to https://emergent.sh"
    echo "2. Click 'New Project' or 'Deploy'"
    echo "3. Select: 2403717674422018-hue/teacherlog_tracker"
    echo "4. Add environment variable: OPENAI_API_KEY=sk-emergent-59d29C56a61DaC306F"
    echo "5. Click Deploy!"
    echo "6. Your app will be live in 2-3 minutes! 🎉"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "📝 Manual push command:"
    echo "   git push -u origin main"
    echo ""
    echo "🔑 If authentication fails, create a Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select 'repo' scope"
    echo "4. Copy the token"
    echo "5. Use token as password when pushing"
    echo ""
fi
