import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from "ws";
import { tables } from '../shared/schema.js';

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
    
    const allTables = await db
      .select()
      .from(tables)
      .where(eq(tables.isActive, true));
    
    res.status(200).json(allTables);
  } catch (error) {
    console.error('Tables API error:', error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
}
