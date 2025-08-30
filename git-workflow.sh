#!/bin/bash

# Git Workflow Script for Human Voice Record Project
# This script helps manage branches and deployment workflow

echo "🚀 Human Voice Record - Git Workflow Helper"
echo "=========================================="

# Function to create a new feature branch
create_feature_branch() {
    echo "📝 Creating new feature branch..."
    read -p "Enter feature name (e.g., audio-player-improvements): " feature_name
    
    # Create and switch to new branch
    git checkout -b feature/$feature_name
    
    echo "✅ Created and switched to branch: feature/$feature_name"
    echo "💡 Start developing your feature!"
    echo "💡 When ready, use: git add . && git commit -m 'Add feature' && git push origin feature/$feature_name"
}

# Function to deploy to production
deploy_to_production() {
    echo "🚀 Deploying to production..."
    
    # Check if we're on main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo "⚠️  You're not on main branch. Current branch: $current_branch"
        read -p "Do you want to merge to main first? (y/n): " merge_choice
        if [ "$merge_choice" = "y" ]; then
            git checkout main
            git merge $current_branch
            git push origin main
        fi
    fi
    
    echo "📦 Deploying backend..."
    cd backend
    vercel --prod
    cd ..
    
    echo "📦 Deploying frontend..."
    cd frontend
    vercel --prod
    cd ..
    
    echo "✅ Deployment completed!"
}

# Function to setup deployment branch
setup_deployment() {
    echo "🔧 Setting up deployment configuration..."
    
    # Create deployment branch
    git checkout -b deployment-setup
    
    # Add all files
    git add .
    
    # Commit changes
    git commit -m "Add deployment configuration and environment files"
    
    # Push to GitHub
    git push origin deployment-setup
    
    echo "✅ Deployment setup completed!"
    echo "💡 Next steps:"
    echo "   1. Go to Vercel dashboard"
    echo "   2. Import your GitHub repository"
    echo "   3. Configure environment variables"
    echo "   4. Deploy!"
}

# Function to show current status
show_status() {
    echo "📊 Current Git Status:"
    echo "====================="
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --oneline)"
    echo ""
    echo "Recent branches:"
    git branch -r | head -10
}

# Main menu
while true; do
    echo ""
    echo "Choose an option:"
    echo "1) Create new feature branch"
    echo "2) Deploy to production"
    echo "3) Setup deployment configuration"
    echo "4) Show current status"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            create_feature_branch
            ;;
        2)
            deploy_to_production
            ;;
        3)
            setup_deployment
            ;;
        4)
            show_status
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            ;;
    esac
done
