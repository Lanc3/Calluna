import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import ws from "ws";
import { users, sessions, settings } from '../shared/schema.js';

neonConfig.webSocketConstructor = ws;
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ message: 'Database not configured' });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });
    
    const { action } = req.query;
    
    if (action === 'user' && req.method === 'GET') {
      // For serverless, session management needs to be implemented differently
      // For now, return unauthorized - proper session management in serverless needs JWT
      res.status(401).json({ message: 'Unauthorized' });
      
    } else if (action === 'register' && req.method === 'POST') {
      // Check if registration is enabled
      const [setting] = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'registration_enabled'));
      
      if (setting && setting.value === 'false') {
        return res.status(403).json({ 
          message: 'Registration is currently disabled',
          error: 'New admin registrations are not allowed at this time'
        });
      }
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          role: 'admin' // All registered users get admin role
        })
        .returning();
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
      
    } else if (action === 'login' && req.method === 'POST') {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await comparePasswords(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // For serverless, we'd need to implement JWT or similar
      // For now, just return user data
      res.status(200).json(userWithoutPassword);
      
    } else if (action === 'logout' && (req.method === 'POST' || req.method === 'GET')) {
      // For serverless, just return success
      // In a full implementation, we'd clear JWT cookies or invalidate tokens
      res.status(200).json({ message: 'Logged out successfully' });
      
    } else {
      res.status(400).json({ 
        message: 'Invalid action parameter',
        validActions: ['user (GET)', 'register (POST)', 'login (POST)', 'logout (POST/GET)']
      });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}