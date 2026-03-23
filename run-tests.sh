#!/bin/bash
# Quick Test Runner - Run this script to execute tests

cd "$(dirname "$0")"

echo "🧪 Todo List API - Unit Test Suite"
echo "=================================="
echo ""

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --save-dev jest jest-mock-extended supertest
fi

echo ""
echo "Choose test option:"
echo "1) Run all tests"
echo "2) Run tests in watch mode"
echo "3) Run tests with coverage"
echo "4) Run specific test file (e.g., auth.service.test.js)"
echo ""

read -p "Enter option (1-4): " option

case $option in
  1)
    echo ""
    echo "🧪 Running all tests..."
    npm test
    ;;
  2)
    echo ""
    echo "👀 Running tests in watch mode (Ctrl+C to exit)..."
    npm run test:watch
    ;;
  3)
    echo ""
    echo "📊 Running tests with coverage report..."
    npm run test:coverage
    ;;
  4)
    read -p "Enter test file name: " testfile
    echo ""
    echo "🧪 Running tests for $testfile..."
    npm test -- "$testfile"
    ;;
  *)
    echo "Invalid option"
    exit 1
    ;;
esac

echo ""
echo "✅ Test run complete!"
