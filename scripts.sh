#!/bin/bash

# Recall.ai Soundboard Docker Helper Scripts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.sample..."
        if [ -f ".env.sample" ]; then
            cp .env.sample .env
            print_message "Created .env file from .env.sample"
            print_warning "Please update .env file with your actual values before running the application"
        else
            print_error ".env.sample not found. Please create .env file manually"
            exit 1
        fi
    fi
}

# Development commands
dev_build() {
    print_message "Building development Docker image..."
    docker-compose -f docker-compose.dev.yml build
}

dev_up() {
    print_message "Starting development environment..."
    check_env_file
    docker-compose -f docker-compose.dev.yml up
    print_message "Development environment started!"
    print_message "Access the application at: http://localhost:${PORT:-4000}"
}

dev_down() {
    print_message "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
}

dev_up_detached() {
    print_message "Starting development environment in detached mode..."
    check_env_file
    docker-compose -f docker-compose.dev.yml up -d
    print_message "Development environment started in background!"
    print_message "Access the application at: http://localhost:${PORT:-4000}"
    print_message "Use 'dev:logs' to view logs"
}

dev_logs() {
    print_message "Showing development logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Production commands
prod_build() {
    print_message "Building production Docker image..."
    docker-compose build
}

prod_up() {
    print_message "Starting production environment..."
    check_env_file
    docker-compose up
    print_message "Production environment started!"
    print_message "Access the application at: http://localhost:${PORT:-4000}"
}

prod_down() {
    print_message "Stopping production environment..."
    docker-compose down
}

prod_up_detached() {
    print_message "Starting production environment in detached mode..."
    check_env_file
    docker-compose up -d
    print_message "Production environment started in background!"
    print_message "Access the application at: http://localhost:${PORT:-4000}"
    print_message "Use 'prod:logs' to view logs"
}

prod_logs() {
    print_message "Showing production logs..."
    docker-compose logs -f
}

# Utility commands
health_check() {
    print_message "Checking application heartbeat..."
    curl -f http://localhost:${PORT:-4000}/api/heartbeat || print_error "Heartbeat check failed"
}

network_test() {
    print_message "Testing external network connectivity from container..."
    
    # Check if container is running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "No running containers found. Please start the application first."
        exit 1
    fi
    
    # Test DNS resolution
    print_message "Testing DNS resolution..."
    docker-compose exec soundboard nslookup google.com || print_error "DNS resolution failed"
    
    # Test external connectivity
    print_message "Testing external HTTP connectivity..."
    docker-compose exec soundboard curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/get || print_error "External HTTP test failed"
    
    # Test Recall.ai API connectivity (if env vars are set)
    if [ -n "$RECALLAI_BASE_URL" ]; then
        print_message "Testing Recall.ai API connectivity..."
        docker-compose exec soundboard curl -s -o /dev/null -w "%{http_code}" "$RECALLAI_BASE_URL" || print_error "Recall.ai API test failed"
    fi
    
    print_message "Network connectivity test completed!"
}

cleanup() {
    print_message "Cleaning up Docker resources..."
    docker system prune -f
    print_message "Cleanup completed!"
}

# Help function
show_help() {
    echo -e "${BLUE}Recall.ai Soundboard Docker Helper${NC}"
    echo -e "${GREEN}🌐 Network: Host mode enabled for external API access${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Development Commands:"
    echo "  dev:build       Build development Docker image"
    echo "  dev:up          Start development environment (with logs)"
    echo "  dev:up:detached Start development environment in background"
    echo "  dev:down        Stop development environment"
    echo "  dev:logs        Show development logs"
    echo ""
    echo "Production Commands:"
    echo "  prod:build       Build production Docker image"
    echo "  prod:up          Start production environment (with logs)"
    echo "  prod:up:detached Start production environment in background"
    echo "  prod:down        Stop production environment"
    echo "  prod:logs        Show production logs"
    echo ""
    echo "Utility Commands:"
    echo "  health        Check application heartbeat"
    echo "  network       Test external network connectivity"
    echo "  cleanup       Clean up Docker resources"
    echo "  help          Show this help message"
    echo ""
    echo "Note: If you experience network connectivity issues, try:"
    echo "  docker-compose -f docker-compose.alternative.yml up -d"
    echo ""
}

# Main script logic
case "$1" in
    "dev:build")
        dev_build
        ;;
    "dev:up")
        dev_up
        ;;
    "dev:up:detached")
        dev_up_detached
        ;;
    "dev:down")
        dev_down
        ;;
    "dev:logs")
        dev_logs
        ;;
    "prod:build")
        prod_build
        ;;
    "prod:up")
        prod_up
        ;;
    "prod:up:detached")
        prod_up_detached
        ;;
    "prod:down")
        prod_down
        ;;
    "prod:logs")
        prod_logs
        ;;
    "health")
        health_check
        ;;
    "network")
        network_test
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 