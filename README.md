# Calluna Bar & Grill - Restaurant Management System

A sophisticated full-stack restaurant booking platform with advanced location-specific table management, dynamic floor plan interactions, and comprehensive administrative controls.

## 🚀 Features

- **Customer Booking System**: Interactive table selection with location-based floor plans
- **Admin Panel**: Complete restaurant management with booking approval workflow
- **Location Management**: Multi-area dining management (main dining, bar, patio, etc.)
- **Floor Plan Designer**: Drag-and-drop table and visual element positioning
- **Menu Management**: Dynamic menu with categories and items
- **Gallery Management**: Restaurant image showcase
- **Contact & Hours**: Dynamic contact information and opening hours
- **Customizable Views**: Admin booking list with column selection
- **Authentication**: Local email/password system for admin access

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** with Neon serverless
- **Drizzle ORM** for database operations
- **Express Sessions** with PostgreSQL storage
- **Passport.js** for authentication

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:

1. **Node.js** (version 18 or higher)
2. **PostgreSQL database** (Neon, Supabase, or similar)
3. **Vercel account**
4. **Git repository** with your code

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

Choose one of these options:

**Option A: Neon (Recommended)**
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string

**Option B: Supabase**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

**Option C: Railway**
1. Go to [Railway](https://railway.app/)
2. Create a new PostgreSQL service
3. Copy the connection string

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
PGHOST="your-host"
PGPORT="5432"
PGUSER="your-username"
PGPASSWORD="your-password"
PGDATABASE="your-database"

# Session Secret (generate a secure random string)
SESSION_SECRET="your-super-secret-session-key-here"

# Node Environment
NODE_ENV="production"
```

### 3. Initialize Database Schema

You need to set up your database schema. There are two ways to do this:

**Option A: Using Local Development Environment (Recommended)**

1. **Set up environment locally**:
   ```bash
   # Clone your repository locally
   git clone <your-repo-url>
   cd your-project
   
   # Install dependencies
   npm install
   
   # Create .env file with your Neon DATABASE_URL
   echo "DATABASE_URL=your-neon-connection-string" > .env
   
   # Push database schema to Neon
   npm run db:push
   ```

**Option B: Using Neon SQL Editor**

1. **Connect to your Neon database** via the Neon Console SQL Editor
2. **Run the following SQL commands** to create all tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE,
        "password" varchar,
        "first_name" varchar,
        "last_name" varchar,
        "role" varchar DEFAULT 'admin',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create sessions table (required for authentication)
CREATE TABLE IF NOT EXISTS "sessions" (
        "sid" varchar PRIMARY KEY,
        "sess" jsonb NOT NULL,
        "expire" timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Create system_settings table
CREATE TABLE IF NOT EXISTS "system_settings" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "key" varchar UNIQUE NOT NULL,
        "value" varchar NOT NULL,
        "description" varchar,
        "updated_at" timestamp DEFAULT now()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS "contact_info" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" varchar NOT NULL,
        "value" varchar NOT NULL,
        "label" varchar,
        "is_active" boolean DEFAULT true,
        "display_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create opening_hours table  
CREATE TABLE IF NOT EXISTS "opening_hours" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "day_of_week" integer NOT NULL,
        "open_time" varchar,
        "close_time" varchar,
        "is_closed" boolean DEFAULT false,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create restaurant_locations table
CREATE TABLE IF NOT EXISTS "restaurant_locations" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" varchar,
        "is_active" boolean DEFAULT true,
        "display_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS "tables" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "number" varchar NOT NULL,
        "capacity" integer NOT NULL,
        "location_id" varchar,
        "x_position" integer NOT NULL,
        "y_position" integer NOT NULL,
        "width" integer DEFAULT 60,
        "height" integer DEFAULT 60,
        "color" varchar DEFAULT '#746899',
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS "bookings" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "customer_name" varchar NOT NULL,
        "customer_email" varchar NOT NULL,
        "customer_phone" varchar,
        "date" varchar NOT NULL,
        "time" varchar NOT NULL,
        "party_size" integer NOT NULL,
        "special_requests" varchar,
        "table_id" varchar,
        "location_id" varchar,
        "status" varchar DEFAULT 'unconfirmed',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS "menu_categories" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" varchar,
        "display_order" integer DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "description" varchar,
        "price" numeric(10, 2),
        "category_id" varchar,
        "display_order" integer DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS "gallery_images" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar,
        "description" varchar,
        "image_url" varchar NOT NULL,
        "display_order" integer DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Create floor_plan_elements table
CREATE TABLE IF NOT EXISTS "floor_plan_elements" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "location_id" varchar,
        "element_type" varchar NOT NULL,
        "x_position" integer NOT NULL,
        "y_position" integer NOT NULL,
        "width" integer NOT NULL,
        "height" integer NOT NULL,
        "rotation" integer DEFAULT 0,
        "color" varchar DEFAULT '#746899',
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

-- Insert default system setting to enable registration
INSERT INTO "system_settings" ("id", "key", "value", "description") 
VALUES (gen_random_uuid(), 'registration_enabled', 'true', 'Enable new admin registrations')
ON CONFLICT ("key") DO UPDATE SET "value" = 'true';

-- Insert default restaurant location
INSERT INTO "restaurant_locations" ("id", "name", "description", "display_order") 
VALUES (gen_random_uuid(), 'Main Dining Room', 'Primary dining area', 1)
ON CONFLICT DO NOTHING;
```

## 🚀 Vercel Deployment

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for first deployment)
   - Project name: `calluna-restaurant` (or your preferred name)
   - In which directory is your code located? `./`

### Method 2: Vercel Dashboard

1. **Connect Git Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository (GitHub, GitLab, or Bitbucket)

2. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
   - **Node.js Version**: `18.x` or `20.x`
   
   > **Note**: Vercel will automatically detect and build both the frontend (from `package.json`) and the serverless API (from `server/index.ts`) based on the `vercel.json` configuration.

### 3. Environment Variables Setup

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from your `.env` file:

```
DATABASE_URL = postgresql://username:password@host:port/database?sslmode=require
PGHOST = your-host
PGPORT = 5432
PGUSER = your-username
PGPASSWORD = your-password
PGDATABASE = your-database
SESSION_SECRET = your-super-secret-session-key-here
NODE_ENV = production
```

### 4. Deploy

Click **Deploy** or push to your main branch to trigger automatic deployment.

## ⚙️ Configuration Files

The project includes essential configuration files for Vercel deployment:

### `vercel.json` (automatically configured)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

## 🔧 Post-Deployment Setup

### 1. Enable Registration and Create Admin Account

After deployment, you'll need to enable registration and create an admin account:

1. **Enable Registration** (one-time setup):
   - Connect to your PostgreSQL database using a client like pgAdmin, TablePlus, or psql
   - Run this SQL command to enable registration:
     ```sql
     UPDATE system_settings SET value = 'true' WHERE key = 'registration_enabled';
     ```
   - If the setting doesn't exist, create it:
     ```sql
     INSERT INTO system_settings (id, key, value, description) 
     VALUES (gen_random_uuid(), 'registration_enabled', 'true', 'Enable new admin registrations');
     ```

2. **Create Admin Account**:
   - Visit your deployed app URL
   - Go to `/auth`
   - Register with your admin email and password
   - All registered users are automatically assigned admin role

3. **Disable Registration** (optional, for security):
   - After creating your admin accounts, you can disable registration:
     ```sql
     UPDATE system_settings SET value = 'false' WHERE key = 'registration_enabled';
     ```

### 2. Initial Data Setup

Access the admin panel to set up:

- **Locations**: Create dining areas (Main Dining, Bar, Patio, etc.)
- **Tables**: Add tables and position them on floor plans
- **Menu**: Create categories and menu items
- **Gallery**: Upload restaurant images
- **Contact Info**: Add phone, email, and address
- **Opening Hours**: Set restaurant hours

## 🏗️ Development

### Local Development

1. **Clone and install**:
   ```bash
   git clone <your-repo-url>
   cd calluna-restaurant
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Initialize database**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: `http://localhost:5000`
   - Admin Panel: `http://localhost:5000/admin`
   - Auth: `http://localhost:5000/auth`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🎯 Usage

### For Customers
1. Browse restaurant gallery and menu
2. Make reservations by selecting tables on interactive floor plan
3. Choose preferred location (dining area)
4. Provide contact details and special requests

### For Administrators
1. Login at `/auth` with admin credentials
2. Access admin panel at `/admin`
3. Manage bookings (confirm/cancel reservations)
4. Configure restaurant settings (tables, menu, hours, contact info)
5. Design floor plans with drag-and-drop interface
6. View customizable booking reports

## 🎨 Customization

### Color Theme
The app uses a purple color scheme (#746899). To change:

1. Edit CSS variables in `client/src/index.css`
2. Update Tailwind config in `tailwind.config.ts`
3. Modify default colors in `shared/schema.ts`

### Styling
- Built with Tailwind CSS and shadcn/ui components
- Custom fonts: Playfair Display (headings) and Lato (body)
- Responsive design for all screen sizes

## 🔍 Troubleshooting

### Common Issues

1. **404 NOT_FOUND Error on Vercel**:
   - Ensure `vercel.json` is properly configured to build from TypeScript source
   - Check that build output directory is `dist/public` for static files
   - Verify API routes are pointing to `server/index.ts`, not built files
   - Run `npm run build` locally to verify it creates `dist/public/` directory
   - Try redeploying after clearing Vercel cache

2. **Database Connection Errors**:
   - Verify DATABASE_URL format and credentials
   - Ensure database allows external connections
   - Check SSL requirements
   - Make sure all database environment variables are set

3. **Build Failures**:
   - Verify all environment variables are set in Vercel
   - Check Node.js version compatibility (use 18.x or 20.x)
   - Ensure all dependencies are installed
   - Check TypeScript compilation errors

4. **500 FUNCTION_INVOCATION_FAILED Error**:
   - This indicates the Vercel serverless function failed to execute
   - Most commonly caused by missing database tables or environment variables
   - Ensure you've followed the "Initialize Database Schema" steps above
   - Check that all environment variables are set in Vercel dashboard
   - Visit `/api/test` to verify basic function execution and environment setup
   - Check that all API files are deployed in the Functions tab of your Vercel dashboard

5. **Registration Disabled Error**:
   - If you get "Registration is currently disabled", run this SQL command:
     ```sql
     UPDATE system_settings SET value = 'true' WHERE key = 'registration_enabled';
     ```
   - This is a security feature that can be toggled in the admin panel

5. **Authentication Issues**:
   - Verify SESSION_SECRET is set
   - Check database sessions table exists
   - Ensure PostgreSQL store is configured
   - Run `npm run db:push` to create sessions table

6. **API 404 Errors on Vercel**:
   - Check that all API files in the `api/` folder are properly deployed
   - Ensure each serverless function has the correct export structure
   - Verify the functions appear in Vercel's Functions dashboard
   - Try accessing `/api/test` first to verify basic serverless function execution
   - If functions don't appear, check that vercel.json properly configures the runtime

7. **Permission Errors**:
   - All registered users get admin role automatically
   - Check middleware configuration
   - Verify user role in database

### Support

For issues and questions:
1. Check the logs in Vercel dashboard
2. Verify environment variables
3. Test database connectivity
4. Review build outputs

## 📄 License

This project is proprietary software for Calluna Bar & Grill.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.

---

**Deployed successfully?** Visit your live application and start managing your restaurant bookings! 🎉