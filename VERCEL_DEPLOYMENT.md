# Vercel Deployment Guide for Calluna Bar & Grill

This guide provides step-by-step instructions for deploying the Calluna Bar & Grill restaurant website to Vercel.

## Prerequisites

- Git repository with your project code
- Vercel account (free tier available)
- PostgreSQL database (Neon, Supabase, or similar serverless provider)
- Environment variables properly configured

## Project Structure

The application is built using:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (requires adaptation for production)

## Step 1: Prepare Your Code Repository

1. Ensure your code is in a Git repository (GitHub, GitLab, or Bitbucket)
2. Make sure all dependencies are listed in `package.json`
3. Verify build scripts are configured correctly

## Step 2: Database Setup

### Option A: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Create tables using Drizzle:
   ```bash
   npx drizzle-kit push
   ```

### Option B: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get the PostgreSQL connection string
4. Run database migrations

## Step 3: Environment Variables

Set these environment variables in Vercel:

### Required Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-session-secret-here
NODE_ENV=production
```

### Authentication Variables (if using custom auth)
```
ISSUER_URL=https://your-auth-provider.com/oidc
REPL_ID=your-app-id
REPLIT_DOMAINS=your-domain.vercel.app
```

## Step 4: Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "outputDirectory": "client/dist",
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Step 5: Build Configuration

Update your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/server.js",
    "start": "node dist/server.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Step 6: Authentication Adaptation

Since the project uses Replit Auth, you'll need to adapt for production:

### Option A: Replace with NextAuth.js
1. Install NextAuth.js
2. Configure providers (Google, GitHub, etc.)
3. Update authentication middleware

### Option B: Custom OAuth Implementation
1. Set up OAuth with your chosen provider
2. Update `server/replitAuth.ts` with new provider
3. Configure redirect URLs in provider dashboard

## Step 7: Deploy to Vercel

### Via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables
5. Deploy

### Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 8: Post-Deployment Setup

1. **Database Migration**: Run your database migrations
   ```bash
   npm run db:push
   ```

2. **Domain Configuration**: Set up custom domain in Vercel dashboard

3. **SSL Certificate**: Vercel automatically provides SSL

4. **Environment Testing**: Test all features in production environment

## Step 9: Continuous Deployment

Set up automatic deployments:
1. Connect your Git repository to Vercel
2. Enable automatic deployments on push to main branch
3. Set up preview deployments for pull requests

## Common Issues and Solutions

### Build Errors
- Ensure all TypeScript types are correctly defined
- Check that all imports use correct paths
- Verify environment variables are set

### Database Connection
- Use connection pooling for serverless functions
- Set appropriate connection limits
- Use SSL connections for production databases

### Authentication Issues
- Update redirect URLs in OAuth provider
- Ensure session storage works with serverless functions
- Test authentication flow thoroughly

### Performance Optimization
- Enable static file caching
- Optimize images and assets
- Use CDN for static resources

## Monitoring and Maintenance

1. **Analytics**: Set up Vercel Analytics
2. **Error Tracking**: Integrate Sentry or similar
3. **Performance**: Monitor Core Web Vitals
4. **Database**: Monitor connection usage and performance

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Authentication provider configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking enabled
- [ ] Backup strategy implemented
- [ ] Monitoring dashboards set up

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **Database**: Use SSL connections and proper access controls
3. **Authentication**: Implement proper session management
4. **API**: Add rate limiting and input validation
5. **Headers**: Configure security headers in Vercel

## Cost Optimization

1. **Vercel Limits**: Monitor usage to stay within free tier
2. **Database**: Optimize queries and use connection pooling
3. **Assets**: Compress images and use efficient formats
4. **Caching**: Implement proper caching strategies

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Database Docs](https://neon.tech/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Express.js Guide](https://expressjs.com/)

For additional support with deployment issues, consult the Vercel community or create support tickets through their dashboard.