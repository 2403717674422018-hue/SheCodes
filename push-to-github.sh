#!/bin/bash

# TeacherLoggg - GitHub Push Script
# Replace the values below with YOUR GitHub details

echo "🚀 TeacherLoggg GitHub Push Script"
echo "=================================="
echo ""

# ⚠️ REPLACE THESE WITH YOUR DETAILS:
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"
REPO_NAME="YOUR_REPO_NAME"

echo "⚠️  BEFORE RUNNING THIS SCRIPT:"
echo "1. Open this file: /app/push-to-github.sh"
echo "2. Replace YOUR_GITHUB_USERNAME with your GitHub username"
echo "3. Replace YOUR_REPO_NAME with your repository name"
echo "4. Save the file"
echo "5. Run: bash /app/push-to-github.sh"
echo ""

# Check if user updated the variables
if [ "$GITHUB_USERNAME" = "YOUR_GITHUB_USERNAME" ]; then
    echo "❌ ERROR: You haven't updated GITHUB_USERNAME yet!"
    echo ""
    echo "Please edit this file and replace:"
    echo "  GITHUB_USERNAME=\"YOUR_GITHUB_USERNAME\""
    echo "with:"
    echo "  GITHUB_USERNAME=\"your-actual-username\""
    echo ""
    exit 1
fi

if [ "$REPO_NAME" = "YOUR_REPO_NAME" ]; then
    echo "❌ ERROR: You haven't updated REPO_NAME yet!"
    echo ""
    echo "Please edit this file and replace:"
    echo "  REPO_NAME=\"YOUR_REPO_NAME\""
    echo "with:"
    echo "  REPO_NAME=\"teacherloggg\"  (or your repo name)"
    echo ""
    exit 1
fi

# Construct GitHub URL
GITHUB_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "📋 Configuration:"
echo "  GitHub Username: $GITHUB_USERNAME"
echo "  Repository Name: $REPO_NAME"
echo "  GitHub URL: $GITHUB_URL"
echo ""

# Navigate to project
cd /app

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "🔄 Remote 'origin' already exists, updating..."
    git remote set-url origin $GITHUB_URL
else
    echo "➕ Adding remote 'origin'..."
    git remote add origin $GITHUB_URL
fi

echo ""
echo "🚀 Pushing to GitHub..."
echo "   (You may be asked for GitHub credentials)"
echo ""

# Push to GitHub
git branch -M main
git push -u origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Go to https://emergent.sh"
    echo "2. Click 'New Project' or 'Deploy'"
    echo "3. Select your GitHub repository"
    echo "4. Add environment variable: OPENAI_API_KEY"
    echo "5. Click Deploy!"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "Common issues:"
    echo "1. Wrong username or repository name"
    echo "2. Repository doesn't exist on GitHub"
    echo "3. Need to use Personal Access Token instead of password"
    echo ""
    echo "To create a Personal Access Token:"
    echo "1. Go to github.com → Settings → Developer settings"
    echo "2. Personal access tokens → Generate new token"
    echo "3. Select 'repo' scope"
    echo "4. Use token as password when pushing"
    echo ""
fi
