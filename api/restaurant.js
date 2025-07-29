import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { asc, eq } from 'drizzle-orm';
import ws from "ws";
import { tables, restaurantLocations, gallery, contactInfo, openingHours } from '../shared/schema.js';

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
    
    const { type } = req.query;
    
    switch (type) {
      case 'tables':
        const allTables = await db
          .select()
          .from(tables)
          .where(eq(tables.isActive, true));
        res.status(200).json(allTables);
        break;
        
      case 'locations':
        const locations = await db
          .select()
          .from(restaurantLocations)
          .where(eq(restaurantLocations.isActive, true))
          .orderBy(asc(restaurantLocations.displayOrder));
        res.status(200).json(locations);
        break;
        
      case 'gallery':
        const images = await db.select().from(gallery);
        res.status(200).json(images);
        break;
        
      case 'contact':
        const contact = await db
          .select()
          .from(contactInfo)
          .where(eq(contactInfo.isActive, true))
          .orderBy(asc(contactInfo.displayOrder));
        res.status(200).json(contact);
        break;
        
      case 'hours':
        const hours = await db
          .select()
          .from(openingHours)
          .where(eq(openingHours.isActive, true))
          .orderBy(asc(openingHours.dayOfWeek));
        res.status(200).json(hours);
        break;
        
      default:
        res.status(400).json({ 
          message: 'Missing or invalid type parameter', 
          validTypes: ['tables', 'locations', 'gallery', 'contact', 'hours']
        });
    }
  } catch (error) {
    console.error('Restaurant API error:', error);
    res.status(500).json({ message: 'Failed to fetch restaurant data' });
  }
}