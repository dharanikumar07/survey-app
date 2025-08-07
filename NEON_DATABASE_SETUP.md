# 🗄️ Neon.tech PostgreSQL Database Setup

This guide will help you connect your Shopify app to a Neon.tech PostgreSQL database instead of using a local database.

## 📋 Prerequisites

- Neon.tech account (free tier available)
- Your Shopify app project ready
- Access to your `web/.env` file

## 🚀 Step-by-Step Setup

### Step 1: Create Neon.tech Database

1. **Sign up/Login** to [Neon.tech](https://neon.tech)
2. **Create a new project**:
   - Click "Create Project"
   - Choose a project name (e.g., "shopify-app-boilerplate")
   - Select a region close to your users
   - Click "Create Project"

### Step 2: Get Database Credentials

From your Neon.tech project dashboard, you'll find:

1. **Connection Details**:
   - Host: `ep-cool-name-123456.us-east-2.aws.neon.tech`
   - Database: `neondb` (or your custom name)
   - Username: `your_neon_username`
   - Password: `your_neon_password`
   - Port: `5432`

2. **Connection String** (recommended):
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Update Environment Configuration

Update your `web/.env` file with Neon.tech credentials:

```env
# Laravel Configuration
APP_NAME="Shopify App Boilerplate"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Neon.tech PostgreSQL Database Configuration
DB_CONNECTION=pgsql
DB_HOST=ep-cool-name-123456.us-east-2.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=your_neon_username
DB_PASSWORD=your_neon_password
DB_SSLMODE=require

# Alternative: Using connection string (recommended)
# DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Shopify Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_SCOPES=read_products,write_products,read_orders,write_orders
SHOPIFY_APP_HOST_NAME=your-ngrok-url.ngrok.io
```

### Step 4: Update Database Configuration

Edit `web/config/database.php` to ensure PostgreSQL configuration:

```php
'default' => env('DB_CONNECTION', 'pgsql'),

'connections' => [
    'pgsql' => [
        'driver' => 'pgsql',
        'url' => env('DATABASE_URL'),
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '5432'),
        'database' => env('DB_DATABASE', 'forge'),
        'username' => env('DB_USERNAME', 'forge'),
        'password' => env('DB_PASSWORD', ''),
        'charset' => 'utf8',
        'prefix' => '',
        'prefix_indexes' => true,
        'search_path' => 'public',
        'sslmode' => env('DB_SSLMODE', 'require'),
    ],
],
```

### Step 5: Install PostgreSQL Extension (if needed)

If you're using Laravel Sail or Docker, ensure PostgreSQL client is installed:

```bash
# For Ubuntu/Debian
sudo apt-get install php-pgsql

# For macOS with Homebrew
brew install postgresql

# For Windows
# Download PostgreSQL client from https://www.postgresql.org/download/windows/
```

### Step 6: Test Database Connection

```bash
cd web

# Test connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Run migrations
php artisan migrate

# Check tables
php artisan tinker
>>> Schema::hasTable('sessions')
>>> Schema::hasTable('stores')
>>> exit
```

## 🔧 Alternative: Using Connection String

For better security and easier management, use the connection string approach:

### Update `.env`:
```env
# Remove individual DB_* variables
# DB_HOST=...
# DB_PORT=...
# DB_DATABASE=...
# DB_USERNAME=...
# DB_PASSWORD=...

# Use connection string instead
DATABASE_URL=postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Update `config/database.php`:
```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => parse_url(env('DATABASE_URL'), PHP_URL_HOST),
    'port' => parse_url(env('DATABASE_URL'), PHP_URL_PORT),
    'database' => ltrim(parse_url(env('DATABASE_URL'), PHP_URL_PATH), '/'),
    'username' => parse_url(env('DATABASE_URL'), PHP_URL_USER),
    'password' => parse_url(env('DATABASE_URL'), PHP_URL_PASS),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'require',
],
```

## 🐳 Docker Configuration (if using Docker)

If you're using Docker, update your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=pgsql
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_DATABASE=${DB_DATABASE}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSLMODE=require
    volumes:
      - .:/var/www/html
    depends_on:
      - postgres

  # Remove local postgres service if using Neon
  # postgres:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: shopify_app
  #     POSTGRES_USER: postgres
  #     POSTGRES_PASSWORD: password
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. SSL Connection Error
```
SQLSTATE[08006] [7] could not connect to server: SSL error: certificate verify failed
```

**Solution**: Ensure `DB_SSLMODE=require` is set in your `.env`

#### 2. Connection Timeout
```
SQLSTATE[08006] [7] could not connect to server: Connection timed out
```

**Solution**: 
- Check your Neon.tech project is active
- Verify host/port details
- Check firewall settings

#### 3. Authentication Failed
```
SQLSTATE[28P01] [7] FATAL: password authentication failed
```

**Solution**:
- Verify username/password in Neon.tech dashboard
- Check if credentials are correctly set in `.env`

#### 4. Database Not Found
```
SQLSTATE[3D000] [7] FATAL: database "neondb" does not exist
```

**Solution**:
- Create database in Neon.tech dashboard
- Check database name in `.env`

### Debug Commands:

```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check current database
>>> DB::connection()->getDatabaseName();

# List all tables
>>> Schema::getAllTables();

# Run migrations with verbose output
php artisan migrate --verbose

# Clear config cache
php artisan config:clear
php artisan cache:clear
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit database credentials to version control
2. **SSL Mode**: Always use `sslmode=require` for production
3. **Connection Pooling**: Consider using Neon.tech's connection pooling for production
4. **Backup**: Neon.tech provides automatic backups, but consider additional backup strategies

## 📊 Neon.tech Features

- **Automatic Scaling**: Scales based on usage
- **Branching**: Create database branches for development
- **Connection Pooling**: Built-in connection pooling
- **Automatic Backups**: Point-in-time recovery
- **Serverless**: Pay only for what you use

## 🚀 Next Steps

After successful connection:

1. **Run migrations**: `php artisan migrate`
2. **Seed database** (if needed): `php artisan db:seed`
3. **Test OAuth flow**: Install app in Shopify store
4. **Verify session storage**: Check `sessions` and `stores` tables

Your Shopify app is now connected to Neon.tech PostgreSQL! 🎉

---

**Need help?** Check Neon.tech documentation or Laravel database configuration guides. 