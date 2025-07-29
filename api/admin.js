import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, desc } from 'drizzle-orm';
import ws from "ws";
import { 
  restaurantLocations, 
  menuCategories, 
  menuItems, 
  tables,
  bookings,
  gallery,
  contactInfo,
  openingHours,
  settings,
  floorPlanElements
} from '../shared/schema.js';

neonConfig.webSocketConstructor = ws;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ message: 'Database not configured' });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });
    
    // Parse the URL path to determine the resource and action
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Expected path: /api/admin/{resource}/{id?}
    if (pathParts.length < 2 || pathParts[1] !== 'admin') {
      return res.status(400).json({ message: 'Invalid admin API path' });
    }
    
    const resource = pathParts[2];
    const resourceId = pathParts[3];
    
    // Handle different resources
    switch (resource) {
      case 'locations':
        return await handleLocations(req, res, db, resourceId);
      case 'menu-categories':
        return await handleMenuCategories(req, res, db, resourceId);
      case 'menu-items':
        return await handleMenuItems(req, res, db, resourceId);
      case 'tables':
        return await handleTables(req, res, db, resourceId);
      case 'bookings':
        return await handleBookings(req, res, db, resourceId);
      case 'gallery':
        return await handleGallery(req, res, db, resourceId);
      case 'contact':
        return await handleContact(req, res, db, resourceId);
      case 'hours':
        return await handleHours(req, res, db, resourceId);
      case 'settings':
        return await handleSettings(req, res, db, resourceId);
      case 'floor-elements':
        return await handleFloorElements(req, res, db, resourceId);
      default:
        return res.status(400).json({ message: 'Invalid admin resource' });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ message: 'Admin operation failed' });
  }
}

// Location management
async function handleLocations(req, res, db, id) {
  if (req.method === 'GET') {
    const locations = await db.select().from(restaurantLocations).orderBy(restaurantLocations.displayOrder);
    return res.status(200).json(locations);
  }
  
  if (req.method === 'POST') {
    const [location] = await db.insert(restaurantLocations).values(req.body).returning();
    return res.status(201).json(location);
  }
  
  if (req.method === 'PUT' && id) {
    const [location] = await db.update(restaurantLocations)
      .set(req.body)
      .where(eq(restaurantLocations.id, id))
      .returning();
    return res.status(200).json(location);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(restaurantLocations).where(eq(restaurantLocations.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Menu categories management
async function handleMenuCategories(req, res, db, id) {
  if (req.method === 'GET') {
    const categories = await db.select().from(menuCategories).orderBy(menuCategories.displayOrder);
    return res.status(200).json(categories);
  }
  
  if (req.method === 'POST') {
    const [category] = await db.insert(menuCategories).values(req.body).returning();
    return res.status(201).json(category);
  }
  
  if (req.method === 'PUT' && id) {
    const [category] = await db.update(menuCategories)
      .set(req.body)
      .where(eq(menuCategories.id, id))
      .returning();
    return res.status(200).json(category);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(menuCategories).where(eq(menuCategories.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Menu items management
async function handleMenuItems(req, res, db, id) {
  if (req.method === 'GET') {
    const items = await db.select().from(menuItems).orderBy(menuItems.displayOrder);
    return res.status(200).json(items);
  }
  
  if (req.method === 'POST') {
    const [item] = await db.insert(menuItems).values(req.body).returning();
    return res.status(201).json(item);
  }
  
  if (req.method === 'PUT' && id) {
    const [item] = await db.update(menuItems)
      .set(req.body)
      .where(eq(menuItems.id, id))
      .returning();
    return res.status(200).json(item);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Tables management
async function handleTables(req, res, db, id) {
  if (req.method === 'GET') {
    const allTables = await db.select().from(tables);
    return res.status(200).json(allTables);
  }
  
  if (req.method === 'POST') {
    const [table] = await db.insert(tables).values(req.body).returning();
    return res.status(201).json(table);
  }
  
  if (req.method === 'PUT' && id) {
    const [table] = await db.update(tables)
      .set(req.body)
      .where(eq(tables.id, id))
      .returning();
    return res.status(200).json(table);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(tables).where(eq(tables.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Bookings management
async function handleBookings(req, res, db, id) {
  if (req.method === 'GET') {
    const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return res.status(200).json(allBookings);
  }
  
  if (req.method === 'POST') {
    const [booking] = await db.insert(bookings).values(req.body).returning();
    return res.status(201).json(booking);
  }
  
  if (req.method === 'PUT' && id) {
    const [booking] = await db.update(bookings)
      .set(req.body)
      .where(eq(bookings.id, id))
      .returning();
    return res.status(200).json(booking);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(bookings).where(eq(bookings.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Gallery management
async function handleGallery(req, res, db, id) {
  if (req.method === 'GET') {
    const images = await db.select().from(gallery);
    return res.status(200).json(images);
  }
  
  if (req.method === 'POST') {
    const [image] = await db.insert(gallery).values(req.body).returning();
    return res.status(201).json(image);
  }
  
  if (req.method === 'PUT' && id) {
    const [image] = await db.update(gallery)
      .set(req.body)
      .where(eq(gallery.id, id))
      .returning();
    return res.status(200).json(image);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(gallery).where(eq(gallery.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Contact info management
async function handleContact(req, res, db, id) {
  if (req.method === 'GET') {
    const contact = await db.select().from(contactInfo).orderBy(contactInfo.displayOrder);
    return res.status(200).json(contact);
  }
  
  if (req.method === 'POST') {
    const [contactItem] = await db.insert(contactInfo).values(req.body).returning();
    return res.status(201).json(contactItem);
  }
  
  if (req.method === 'PUT' && id) {
    const [contactItem] = await db.update(contactInfo)
      .set(req.body)
      .where(eq(contactInfo.id, id))
      .returning();
    return res.status(200).json(contactItem);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(contactInfo).where(eq(contactInfo.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Opening hours management
async function handleHours(req, res, db, id) {
  if (req.method === 'GET') {
    const hours = await db.select().from(openingHours).orderBy(openingHours.dayOfWeek);
    return res.status(200).json(hours);
  }
  
  if (req.method === 'POST') {
    const [hourItem] = await db.insert(openingHours).values(req.body).returning();
    return res.status(201).json(hourItem);
  }
  
  if (req.method === 'PUT' && id) {
    const [hourItem] = await db.update(openingHours)
      .set(req.body)
      .where(eq(openingHours.id, id))
      .returning();
    return res.status(200).json(hourItem);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(openingHours).where(eq(openingHours.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Settings management
async function handleSettings(req, res, db, id) {
  if (req.method === 'GET') {
    const allSettings = await db.select().from(settings);
    return res.status(200).json(allSettings);
  }
  
  if (req.method === 'POST') {
    const [setting] = await db.insert(settings).values(req.body).returning();
    return res.status(201).json(setting);
  }
  
  if (req.method === 'PUT' && id) {
    const [setting] = await db.update(settings)
      .set(req.body)
      .where(eq(settings.key, id))
      .returning();
    return res.status(200).json(setting);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Floor plan elements management
async function handleFloorElements(req, res, db, id) {
  if (req.method === 'GET') {
    const elements = await db.select().from(floorPlanElements);
    return res.status(200).json(elements);
  }
  
  if (req.method === 'POST') {
    const [element] = await db.insert(floorPlanElements).values(req.body).returning();
    return res.status(201).json(element);
  }
  
  if (req.method === 'PUT' && id) {
    const [element] = await db.update(floorPlanElements)
      .set(req.body)
      .where(eq(floorPlanElements.id, id))
      .returning();
    return res.status(200).json(element);
  }
  
  if (req.method === 'DELETE' && id) {
    await db.delete(floorPlanElements).where(eq(floorPlanElements.id, id));
    return res.status(204).end();
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}