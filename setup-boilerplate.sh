#!/bin/bash

echo "🚀 Setting up Shopify Laravel + React Boilerplate..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "shopify.app.toml" ]; then
    echo "❌ Error: Please run this script from the root directory of the boilerplate"
    exit 1
fi

# Install Laravel dependencies
echo "📦 Installing Laravel dependencies..."
cd web
if [ ! -f "composer.json" ]; then
    echo "❌ Error: composer.json not found in web directory"
    exit 1
fi

composer install --no-interaction
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install Laravel dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install frontend dependencies"
    exit 1
fi

cd ../..

# Copy environment file if it doesn't exist
if [ ! -f "web/.env" ]; then
    echo "📝 Creating .env file..."
    if [ -f "web/.env.example" ]; then
        cp web/.env.example web/.env
        echo "✅ .env file created from .env.example"
    else
        echo "⚠️  Warning: .env.example not found. Please create .env file manually"
    fi
else
    echo "✅ .env file already exists"
fi

# Generate Laravel key
echo "🔑 Generating Laravel application key..."
cd web
php artisan key:generate --no-interaction
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to generate Laravel key"
    exit 1
fi

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --no-interaction
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to run migrations"
    exit 1
fi

cd ..

echo ""
echo "✅ Boilerplate setup complete!"
echo "=================================================="
echo ""
echo "📋 Next steps:"
echo "1. Update web/.env file with your Shopify API credentials:"
echo "   - SHOPIFY_API_KEY"
echo "   - SHOPIFY_API_SECRET"
echo "   - SHOPIFY_APP_HOST_NAME"
echo ""
echo "2. Start the development servers:"
echo "   # Terminal 1: Start Laravel backend"
echo "   cd web && docker-compose up -d"
echo ""
echo "   # Terminal 2: Start React frontend"
echo "   cd web/frontend && npm run dev"
echo ""
echo "3. Access your app:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:80"
echo ""
echo "📚 Documentation: See BOILERPLATE_README.md for detailed instructions"
echo ""
echo "🎉 Happy coding!" 