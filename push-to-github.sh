#!/bin/bash
# Script to push to GitHub repository

echo "Pushing to GitHub repository: sylaw2022/react.js"

# Check if repository exists
git ls-remote https://github.com/sylaw2022/react.js.git > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Repository exists, pushing..."
    git push github main
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
    else
        echo "❌ Push failed. Check your authentication."
    fi
else
    echo "❌ Repository not found on GitHub."
    echo ""
    echo "Please create the repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: react.js"
    echo "3. Owner: sylaw2022"
    echo "4. Make it Private or Public (your choice)"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "Then run this script again:"
    echo "  ./push-to-github.sh"
fi


