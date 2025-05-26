#!/bin/bash

# Create directory structure
cd yourpro
mkdir -p src/{assets,components,config,db,pages,routes,services,styles,types,utils}

# Copy files from backup if they exist, otherwise they will be recreated
cp -r src_backup/* src/ 2>/dev/null || true

# Install dependencies
npm install

# Create uploads directory
mkdir -p uploads
touch uploads/.gitkeep

echo "Directory structure has been restored. Please check that all files are in place." 