# Calluna Bar & Grill - Restaurant Management System

## Overview

This is a full-stack restaurant management system built for Calluna Bar & Grill. The application provides a modern, elegant dining experience with features for customers to view menus, make reservations, and for administrators to manage all aspects of the restaurant operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Vercel serverless functions for REST API
- **Session Management**: Stateless authentication (no Express sessions)
- **Authentication**: Local email/password authentication system
- **Database ORM**: Drizzle ORM for type-safe database operations

### Database Design
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Key Tables**:
  - Users (with role-based access)
  - Tables (restaurant floor plan)
  - Bookings (reservations)
  - Menu categories and items
  - Gallery images
  - Sessions (for authentication)

## Key Components

### Authentication System
- Local email/password authentication system (replaced Replit OAuth)
- Admin-only authentication with role-based access control
- Session-based authentication with PostgreSQL storage
- Dedicated /auth page with login and registration forms
- All registered users assigned admin role for restaurant management

### Reservation System
- Interactive floor plan for table selection
- Multi-step booking process with form validation
- Real-time availability checking
- Customer information collection

### Menu Management
- Categorized menu system with display ordering
- Dynamic menu rendering with fallback to default items
- Admin capabilities for menu updates

### Admin Panel
- Comprehensive dashboard for restaurant management
- Booking management and oversight
- Table management with floor plan editing
- Menu content management
- Gallery image management

### UI/UX Design
- Restaurant-themed design with custom purple color palette (#746899)
- Responsive design for all device sizes
- Elegant typography using Playfair Display and Lato fonts
- Smooth scrolling navigation and animations

## Data Flow

1. **Public Access**: Visitors can browse the restaurant's gallery, menu, and make reservations without authentication
2. **Authentication**: Admin users authenticate via local email/password system
3. **Customer Flow**: Customers can make reservations without requiring authentication for better UX
4. **Admin Flow**: Admin users access management panel for bookings, menu, tables, and gallery management
5. **Data Persistence**: All operations persist to PostgreSQL via Drizzle ORM
6. **Real-time Updates**: TanStack Query handles cache invalidation and updates

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- Express.js server framework
- TypeScript for type safety

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- shadcn/ui component system
- Lucide React for icons

### Database and ORM
- Drizzle ORM for database operations
- Neon serverless PostgreSQL driver
- Drizzle Kit for schema management

### Authentication
- Local email/password authentication system
- Passport.js with LocalStrategy for authentication middleware
- Express sessions with PostgreSQL storage
- bcrypt for password hashing

### Development Tools
- Vite for build tooling and dev server
- ESBuild for server bundling
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

### Development Environment
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Integrated development experience in Replit

### Production Build
- Vite builds optimized frontend bundle
- ESBuild creates server bundle
- Static assets served via Express
- Environment-based configuration

### Database Setup
- Drizzle migrations for schema deployment
- Environment variable configuration for database URL
- Session table automatically managed

### Hosting Considerations
- Designed for Replit hosting environment with Vercel deployment capability
- Uses local authentication system for admin access
- Configured for flexible domain deployment
- Development tools integrated with Replit ecosystem
- Complete Vercel deployment documentation provided in README.md
- Environment variable configuration for production deployment
- PostgreSQL database integration with Neon/Supabase support

## Recent Changes (January 2025)

### Serverless Architecture Migration (January 29, 2025)
- **Complete Express.js to Vercel Serverless Migration** - Rewrote entire backend from Express server to individual serverless functions
- **Database-Connected API Endpoints** - Each API endpoint now connects directly to Neon PostgreSQL using Drizzle ORM
- **Stateless Authentication System** - Removed Express sessions in favor of stateless authentication approach
- **Individual Function Files** - Created separate serverless functions for all API routes (gallery, menu, tables, locations, contact, hours, auth)
- **Direct Database Queries** - Each endpoint performs its own database connection and queries for optimal serverless performance
- **Proper CORS Configuration** - Added comprehensive CORS headers to all serverless functions for cross-origin requests
- **Environment Variable Validation** - All functions validate DATABASE_URL presence before attempting database operations

## Earlier Changes (January 2025)

### Authentication System Overhaul
- **Replaced Replit OAuth** with local email/password authentication system
- **Fixed infinite redirect loops** in admin panel access
- **Implemented admin-only authentication** - customers can make reservations without accounts
- **Added proper session management** with PostgreSQL storage
- **Created dedicated /auth page** with both login and registration forms
- **Resolved logout 404 errors** by supporting both GET and POST logout routes
- **Enhanced role-based access control** with proper React rendering patterns

### Admin Panel Enhancement (January 28, 2025)
- **Contact Information Management** - Admin can add/delete contact details (phone, email, address)
- **Opening Hours Management** - Full CRUD operations for restaurant hours by day of week
- **Registration Control System** - Enable/disable new admin registrations via admin settings
- **Dynamic Footer Integration** - Website footer now displays database-driven contact info and hours
- **Legal Pages Implementation** - Complete privacy policy, terms of service, and accessibility pages
- **Footer Navigation** - All legal pages properly linked and routed from footer
- **Database Schema Expansion** - Added contact_info, opening_hours, and settings tables

### Location Management System (January 28, 2025)
- **Restaurant Location Management** - Complete CRUD system for managing dining areas (main dining, bar, patio, etc.)
- **Location-Based Floor Plans** - Each location now has its own dedicated floor plan view in admin panel
- **Table-Location Relationships** - Tables are now properly associated with specific locations via foreign key
- **Customer Location Selection** - Booking system allows customers to choose preferred dining area
- **Enhanced Table Management** - Admin can filter table view by location and create location-specific layouts
- **Database Integration** - Added restaurant_locations table with proper relationships to tables and bookings
- **Dynamic Location Filtering** - Floor plan editor shows only tables for selected location

### Floor Plan Visual Elements System (January 28, 2025)
- **Comprehensive Visual Elements** - Added support for bars, stairs, toilets, windows, doors, walls, and kitchen elements
- **Location-Specific Elements** - Visual elements are properly filtered and associated with restaurant locations
- **Drag-and-Drop Positioning** - Both tables and visual elements can be dragged to update positions in real-time
- **Enhanced Floor Plan Component** - Created EnhancedFloorPlan with element rendering and drag functionality
- **Admin Management Interface** - Complete CRUD operations for floor plan elements through admin panel
- **Database Schema** - Added floor_plan_elements table with position, size, rotation, and styling properties

### Customizable Booking List View (January 28, 2025)
- **Column Selection System** - Admins can toggle visibility of booking table columns (name, email, phone, date, time, party size, status, special requests, table preference, created date)
- **Professional Table Layout** - Replaced card-based booking display with sortable data table format
- **Enhanced Data Display** - Shows up to 20 bookings with proper formatting and truncation for long text
- **Refresh Functionality** - Manual refresh button with loading states and success notifications
- **Responsive Design** - Horizontal scrolling support for smaller screens with many visible columns

The architecture prioritizes type safety, developer experience, and scalability while maintaining a focus on the restaurant industry's specific needs for reservation management, menu display, and administrative oversight.