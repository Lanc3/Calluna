import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { requireAuth, requireAdmin } from "./middleware";
import { insertBookingSchema, insertTableSchema, insertMenuCategorySchema, insertMenuItemSchema, insertGalleryImageSchema, insertFloorPlanElementSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Public routes
  app.get('/api/tables', async (req, res) => {
    try {
      const tables = await storage.getTables();
      res.json(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });

  app.get('/api/menu/categories', async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching menu categories:", error);
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });

  app.get('/api/menu/items', async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get('/api/gallery', async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get('/api/bookings/date/:date', async (req, res) => {
    try {
      const { date } = req.params;
      const bookings = await storage.getBookingsByDate(date);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Booking routes
  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  // Protected admin routes
  app.get('/api/admin/bookings', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.patch('/api/admin/bookings/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['unconfirmed', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Menu Categories CRUD routes
  app.post('/api/admin/menu/categories', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const categoryData = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        console.error("Error creating menu category:", error);
        res.status(500).json({ message: "Failed to create menu category" });
      }
    }
  });

  app.put('/api/admin/menu/categories/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const categoryData = insertMenuCategorySchema.partial().parse(req.body);
      const category = await storage.updateMenuCategory(id, categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        console.error("Error updating menu category:", error);
        res.status(500).json({ message: "Failed to update menu category" });
      }
    }
  });

  app.delete('/api/admin/menu/categories/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteMenuCategory(id);
      res.json({ message: "Menu category deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu category:", error);
      res.status(500).json({ message: "Failed to delete menu category" });
    }
  });

  // Menu Items CRUD routes
  app.post('/api/admin/menu/items', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        console.error("Error creating menu item:", error);
        res.status(500).json({ message: "Failed to create menu item" });
      }
    }
  });

  app.put('/api/admin/menu/items/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const itemData = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        console.error("Error updating menu item:", error);
        res.status(500).json({ message: "Failed to update menu item" });
      }
    }
  });

  app.delete('/api/admin/menu/items/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteMenuItem(id);
      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Admin table management endpoints
  app.get('/api/admin/tables', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const tables = await storage.getAllTables();
      res.json(tables);
    } catch (error) {
      console.error("Error fetching admin tables:", error);
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });

  app.post('/api/admin/tables', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const tableData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(tableData);
      res.json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid table data", errors: error.errors });
      } else {
        console.error("Error creating table:", error);
        res.status(500).json({ message: "Failed to create table" });
      }
    }
  });

  app.patch('/api/admin/tables/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const tableData = insertTableSchema.partial().parse(req.body);
      const table = await storage.updateTable(id, tableData);
      res.json(table);
    } catch (error) {
      console.error("Error updating table:", error);
      res.status(500).json({ message: "Failed to update table" });
    }
  });

  app.delete('/api/admin/tables/:id', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteTable(id);
      res.json({ message: "Table deleted successfully" });
    } catch (error) {
      console.error("Error deleting table:", error);
      res.status(500).json({ message: "Failed to delete table" });
    }
  });

  app.post('/api/admin/menu/categories', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const categoryData = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(categoryData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        console.error("Error creating menu category:", error);
        res.status(500).json({ message: "Failed to create menu category" });
      }
    }
  });

  app.post('/api/admin/menu/items', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      } else {
        console.error("Error creating menu item:", error);
        res.status(500).json({ message: "Failed to create menu item" });
      }
    }
  });

  app.post('/api/admin/gallery', requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const imageData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(imageData);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid image data", errors: error.errors });
      } else {
        console.error("Error creating gallery image:", error);
        res.status(500).json({ message: "Failed to create gallery image" });
      }
    }
  });

  // Contact info routes
  app.get("/api/contact", async (req, res) => {
    try {
      const contacts = await storage.getContactInfo();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });

  app.post("/api/admin/contact", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const contactData = req.body;
      const contact = await storage.createContactInfo(contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact info:", error);
      res.status(500).json({ message: "Failed to create contact info" });
    }
  });

  app.put("/api/admin/contact/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const contactData = req.body;
      const contact = await storage.updateContactInfo(id, contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact info:", error);
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });

  app.delete("/api/admin/contact/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteContactInfo(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact info:", error);
      res.status(500).json({ message: "Failed to delete contact info" });
    }
  });

  // Opening hours routes
  app.get("/api/hours", async (req, res) => {
    try {
      const hours = await storage.getOpeningHours();
      res.json(hours);
    } catch (error) {
      console.error("Error fetching opening hours:", error);
      res.status(500).json({ message: "Failed to fetch opening hours" });
    }
  });

  app.post("/api/admin/hours", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const hoursData = req.body;
      const hours = await storage.createOpeningHours(hoursData);
      res.json(hours);
    } catch (error) {
      console.error("Error creating opening hours:", error);
      res.status(500).json({ message: "Failed to create opening hours" });
    }
  });

  app.put("/api/admin/hours/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const hoursData = req.body;
      const hours = await storage.updateOpeningHours(id, hoursData);
      res.json(hours);
    } catch (error) {
      console.error("Error updating opening hours:", error);
      res.status(500).json({ message: "Failed to update opening hours" });
    }
  });

  app.delete("/api/admin/hours/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteOpeningHours(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting opening hours:", error);
      res.status(500).json({ message: "Failed to delete opening hours" });
    }
  });

  // Restaurant locations routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getRestaurantLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Admin location routes
  app.post("/api/admin/locations", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const locationData = req.body;
      const location = await storage.createRestaurantLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  app.put("/api/admin/locations/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const locationData = req.body;
      const location = await storage.updateRestaurantLocation(id, locationData);
      res.json(location);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.delete("/api/admin/locations/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      await storage.deleteRestaurantLocation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // System settings routes
  app.get("/api/admin/settings/:key", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { key } = req.params;
      const setting = await storage.getSystemSetting(key);
      res.json(setting || { key, value: null });
    } catch (error) {
      console.error("Error fetching system setting:", error);
      res.status(500).json({ message: "Failed to fetch system setting" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { key, value, description } = req.body;
      const setting = await storage.setSystemSetting(key, value, description);
      res.json(setting);
    } catch (error) {
      console.error("Error setting system setting:", error);
      res.status(500).json({ message: "Failed to set system setting" });
    }
  });

  // Floor plan elements routes
  app.get("/api/admin/floor-plan-elements", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const elements = await storage.getFloorPlanElements();
      res.json(elements);
    } catch (error) {
      console.error("Error fetching floor plan elements:", error);
      res.status(500).json({ message: "Failed to fetch floor plan elements" });
    }
  });

  app.post("/api/admin/floor-plan-elements", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const result = insertFloorPlanElementSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid floor plan element data", errors: result.error.errors });
      }
      const element = await storage.createFloorPlanElement(result.data);
      res.status(201).json(element);
    } catch (error) {
      console.error("Error creating floor plan element:", error);
      res.status(500).json({ message: "Failed to create floor plan element" });
    }
  });

  app.patch("/api/admin/floor-plan-elements/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const element = await storage.updateFloorPlanElement(req.params.id, req.body);
      res.json(element);
    } catch (error) {
      console.error("Error updating floor plan element:", error);
      res.status(500).json({ message: "Failed to update floor plan element" });
    }
  });

  app.delete("/api/admin/floor-plan-elements/:id", requireAdmin, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      await storage.deleteFloorPlanElement(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting floor plan element:", error);
      res.status(500).json({ message: "Failed to delete floor plan element" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
