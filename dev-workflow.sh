#!/bin/bash

echo "🛠️  Development Workflow Script"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create new feature branch
create_feature() {
    read -p "Enter feature name (e.g., add-user-profile): " feature_name
    feature_branch="feature/$feature_name"
    
    print_status "Creating feature branch: $feature_branch"
    git checkout -b $feature_branch
    print_success "Feature branch created: $feature_branch"
    print_status "You can now start developing your feature!"
}

# Function to merge feature to development
merge_to_dev() {
    current_branch=$(git branch --show-current)
    if [[ $current_branch == feature/* ]]; then
        print_status "Merging $current_branch to development..."
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git checkout development
        git pull origin development
        git merge $current_branch
        git push origin development
        print_success "Feature merged to development!"
    else
        print_error "You're not on a feature branch!"
    fi
}

# Function to deploy from development
deploy_dev() {
    print_status "Deploying from development branch..."
    git checkout development
    git pull origin development
    
    # Deploy Backend
    print_status "Deploying Backend..."
    cd backend
    vercel --prod --yes
    cd ..
    
    # Deploy Frontend
    print_status "Deploying Frontend..."
    cd frontend
    vercel --prod --yes
    cd ..
    
    print_success "Development deployment completed!"
}

# Function to merge development to main and deploy
merge_and_deploy() {
    print_status "Merging development to main and deploying..."
    git checkout main
    git pull origin main
    git merge development
    git push origin main
    
    # Deploy using the main deployment script
    ./deploy.sh
}

# Main menu
while true; do
    echo
    echo "=== Development Workflow Menu ==="
    echo "1. Create new feature branch"
    echo "2. Merge feature to development"
    echo "3. Deploy from development"
    echo "4. Merge development to main and deploy"
    echo "5. Quick deploy (from current branch)"
    echo "6. Exit"
    echo
    read -p "Choose an option (1-6): " choice
    
    case $choice in
        1)
            create_feature
            ;;
        2)
            merge_to_dev
            ;;
        3)
            deploy_dev
            ;;
        4)
            merge_and_deploy
            ;;
        5)
            print_status "Quick deploying from current branch..."
            cd backend && vercel --prod --yes && cd ..
            cd frontend && vercel --prod --yes && cd ..
            print_success "Quick deployment completed!"
            ;;
        6)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option!"
            ;;
    esac
done
