import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { asc, eq } from 'drizzle-orm';
import ws from "ws";
import { menuItems } from '../../shared/schema.js';

neonConfig.webSocketConstructor = ws;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ message: 'Database not configured' });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });
    
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.isActive, true))
      .orderBy(asc(menuItems.displayOrder));
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Menu items API error:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
}