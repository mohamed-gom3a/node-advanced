#!/bin/bash

# Test runner script for the blog application
# Usage: ./scripts/test.sh [unit|e2e|all|coverage|watch]

set -e

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

# Function to check if dependencies are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Function to install dependencies if needed
install_dependencies() {
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd client
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Function to run backend unit tests
run_unit_tests() {
    print_status "Running backend unit tests..."
    npm run test:unit
    print_success "Backend unit tests completed"
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    npm run test:e2e
    print_success "E2E tests completed"
}

# Function to run all tests
run_all_tests() {
    print_status "Running all tests..."
    npm test
    print_success "All tests completed"
}

# Function to run tests with coverage
run_coverage_tests() {
    print_status "Running tests with coverage..."
    npm run test:coverage
    print_success "Coverage tests completed"
}

# Function to run tests in watch mode
run_watch_tests() {
    print_status "Running tests in watch mode..."
    npm run test:watch
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    cd client
    npm test
    cd ..
    print_success "Frontend tests completed"
}

# Main script logic
main() {
    local test_type=${1:-"all"}
    
    print_status "Starting test runner..."
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies if package-lock.json doesn't exist
    if [ ! -f "package-lock.json" ]; then
        print_warning "package-lock.json not found, installing dependencies..."
        install_dependencies
    fi
    
    case $test_type in
        "unit")
            run_unit_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "frontend")
            run_frontend_tests
            ;;
        "coverage")
            run_coverage_tests
            ;;
        "watch")
            run_watch_tests
            ;;
        "all")
            run_all_tests
            ;;
        *)
            print_error "Unknown test type: $test_type"
            echo "Usage: $0 [unit|e2e|frontend|all|coverage|watch]"
            exit 1
            ;;
    esac
    
    print_success "Test runner completed successfully!"
}

# Run main function with all arguments
main "$@"
