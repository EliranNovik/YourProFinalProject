#!/bin/bash

# Make script exit on first error
set -e

echo "Setting up YourPro project..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create uploads directory if it doesn't exist
echo "Creating uploads directory..."
mkdir -p uploads

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL and try again."
    exit 1
fi

# Check if database exists, create if it doesn't
echo "Checking database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw yourpro; then
    echo "Creating database..."
    createdb yourpro
fi

# Check if .env file exists, create if it doesn't
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourpro
JWT_SECRET=your-secret-key-here
UPLOAD_DIR=uploads
EOL
    echo "Created .env file. Please update the values with your configuration."
fi

# Initialize database schema
echo "Initializing database schema..."
psql -d yourpro -f src/db/schema.sql

echo "Setup complete! You can now start the development server with 'npm run dev'" 