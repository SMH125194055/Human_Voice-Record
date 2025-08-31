#!/bin/bash

echo "🚀 Starting Complete Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're on branch: $CURRENT_BRANCH"
    read -p "Do you want to switch to main branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout main
        print_success "Switched to main branch"
    else
        print_error "Deployment cancelled. Please switch to main branch manually."
        exit 1
    fi
fi

# Pull latest changes
print_status "Pulling latest changes from main branch..."
git pull origin main

# Deploy Backend
print_status "Deploying Backend..."
cd backend
if vercel --prod --yes; then
    print_success "Backend deployed successfully!"
else
    print_error "Backend deployment failed!"
    exit 1
fi
cd ..

# Deploy Frontend
print_status "Deploying Frontend..."
cd frontend
if vercel --prod --yes; then
    print_success "Frontend deployed successfully!"
else
    print_error "Frontend deployment failed!"
    exit 1
fi
cd ..

print_success "🎉 Complete deployment finished!"
print_status "Your application is now live!"
print_status "Frontend: https://hvr-huzaifa-frontend.vercel.app"
print_status "Backend: https://hvr-huzaifa-backend.vercel.app"
