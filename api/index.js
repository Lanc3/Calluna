// Import the built server bundle
import express from 'express';
import { registerRoutes } from '../dist/index.js';

const app = express();

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  contactInfo: () => contactInfo,
  floorPlanElements: () => floorPlanElements,
  galleryImages: () => galleryImages,
  insertBookingSchema: () => insertBookingSchema,
  insertContactInfoSchema: () => insertContactInfoSchema,
  insertFloorPlanElementSchema: () => insertFloorPlanElementSchema,
  insertGalleryImageSchema: () => insertGalleryImageSchema,
  insertMenuCategorySchema: () => insertMenuCategorySchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertOpeningHoursSchema: () => insertOpeningHoursSchema,
  insertRestaurantLocationSchema: () => insertRestaurantLocationSchema,
  insertSystemSettingSchema: () => insertSystemSettingSchema,
  insertTableSchema: () => insertTableSchema,
  menuCategories: () => menuCategories,
  menuItems: () => menuItems,
  openingHours: () => openingHours,
  restaurantLocations: () => restaurantLocations,
  sessions: () => sessions,
  systemSettings: () => systemSettings,
  tables: () => tables,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("admin"),
  // customer, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tables = pgTable("tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  capacity: integer("capacity").notNull(),
  minCapacity: integer("min_capacity").default(1),
  maxCapacity: integer("max_capacity").default(8),
  tableType: varchar("table_type").default("standard"),
  // "standard", "booth", "high-top", "outdoor", "private"
  location: varchar("location").default("main"),
  // "main", "patio", "bar", "private-room"
  locationId: varchar("location_id").references(() => restaurantLocations.id),
  shape: varchar("shape").default("round"),
  // "round", "square", "rectangular"
  description: text("description"),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  width: integer("width").default(60),
  // in pixels for floor plan
  height: integer("height").default(60),
  // in pixels for floor plan
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  // for special pricing or VIP tables
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var floorPlanElements = pgTable("floor_plan_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationId: varchar("location_id").notNull().references(() => restaurantLocations.id),
  elementType: varchar("element_type").notNull(),
  // 'bar', 'stairs', 'toilet', 'window', 'door', 'wall', 'kitchen'
  name: varchar("name").notNull(),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  rotation: integer("rotation").default(0),
  // 0, 90, 180, 270 degrees
  color: varchar("color").default("#746899"),
  // Default purple color
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  tableId: varchar("table_id").references(() => tables.id),
  locationId: varchar("location_id").references(() => restaurantLocations.id),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  date: varchar("date").notNull(),
  time: varchar("time").notNull(),
  partySize: integer("party_size").notNull(),
  specialRequests: text("special_requests"),
  status: varchar("status").default("unconfirmed"),
  // unconfirmed, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow()
});
var menuCategories = pgTable("menu_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => menuCategories.id),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  url: varchar("url").notNull(),
  alt: varchar("alt").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").unique().notNull(),
  value: text("value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(),
  // 'phone', 'email', 'address', etc.
  label: varchar("label").notNull(),
  value: text("value").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var openingHours = pgTable("opening_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(),
  // 0 = Sunday, 1 = Monday, etc.
  dayName: varchar("day_name").notNull(),
  openTime: varchar("open_time"),
  // e.g., "17:00"
  closeTime: varchar("close_time"),
  // e.g., "23:00"
  isClosed: boolean("is_closed").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var restaurantLocations = pgTable("restaurant_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertTableSchema = createInsertSchema(tables).omit({
  id: true,
  createdAt: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});
var insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
  createdAt: true
});
var insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true
});
var insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true
});
var insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true
});
var insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOpeningHoursSchema = createInsertSchema(openingHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertRestaurantLocationSchema = createInsertSchema(restaurantLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertFloorPlanElementSchema = createInsertSchema(floorPlanElements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  // Table operations
  async getTables() {
    return await db.select().from(tables).where(eq(tables.isActive, true));
  }
  async getAllTables() {
    return await db.select().from(tables);
  }
  async getTable(id) {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table;
  }
  async createTable(table) {
    const [newTable] = await db.insert(tables).values(table).returning();
    return newTable;
  }
  async updateTable(id, table) {
    const [updatedTable] = await db.update(tables).set(table).where(eq(tables.id, id)).returning();
    return updatedTable;
  }
  async deleteTable(id) {
    await db.update(tables).set({ isActive: false }).where(eq(tables.id, id));
  }
  // Booking operations
  async getBookings() {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBooking(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
  async getBookingsByDate(date) {
    return await db.select().from(bookings).where(
      and(eq(bookings.date, date), eq(bookings.status, "confirmed"))
    );
  }
  async createBooking(booking) {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  async updateBooking(id, booking) {
    const [updatedBooking] = await db.update(bookings).set(booking).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }
  async updateBookingStatus(id, status) {
    const [updatedBooking] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }
  async deleteBooking(id) {
    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id));
  }
  // Menu operations
  async getMenuCategories() {
    return await db.select().from(menuCategories).where(eq(menuCategories.isActive, true)).orderBy(menuCategories.displayOrder);
  }
  async getMenuItems() {
    return await db.select().from(menuItems).where(eq(menuItems.isActive, true)).orderBy(menuItems.displayOrder);
  }
  async getMenuItemsByCategory(categoryId) {
    return await db.select().from(menuItems).where(
      and(eq(menuItems.categoryId, categoryId), eq(menuItems.isActive, true))
    );
  }
  async createMenuCategory(category) {
    const [newCategory] = await db.insert(menuCategories).values(category).returning();
    return newCategory;
  }
  async createMenuItem(item) {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }
  async updateMenuCategory(id, category) {
    const [updatedCategory] = await db.update(menuCategories).set(category).where(eq(menuCategories.id, id)).returning();
    return updatedCategory;
  }
  async updateMenuItem(id, item) {
    const [updatedItem] = await db.update(menuItems).set(item).where(eq(menuItems.id, id)).returning();
    return updatedItem;
  }
  async deleteMenuCategory(id) {
    await db.update(menuCategories).set({ isActive: false }).where(eq(menuCategories.id, id));
  }
  async deleteMenuItem(id) {
    await db.update(menuItems).set({ isActive: false }).where(eq(menuItems.id, id));
  }
  // Gallery operations
  async getGalleryImages() {
    return await db.select().from(galleryImages).where(eq(galleryImages.isActive, true));
  }
  async createGalleryImage(image) {
    const [newImage] = await db.insert(galleryImages).values(image).returning();
    return newImage;
  }
  async updateGalleryImage(id, image) {
    const [updatedImage] = await db.update(galleryImages).set(image).where(eq(galleryImages.id, id)).returning();
    return updatedImage;
  }
  async deleteGalleryImage(id) {
    await db.update(galleryImages).set({ isActive: false }).where(eq(galleryImages.id, id));
  }
  // System settings operations
  async getSystemSetting(key) {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }
  async setSystemSetting(key, value, description) {
    const existing = await this.getSystemSetting(key);
    if (existing) {
      const [updated] = await db.update(systemSettings).set({ value, description, updatedAt: /* @__PURE__ */ new Date() }).where(eq(systemSettings.key, key)).returning();
      return updated;
    } else {
      const [created] = await db.insert(systemSettings).values({ key, value, description }).returning();
      return created;
    }
  }
  // Contact info operations
  async getContactInfo() {
    return await db.select().from(contactInfo).where(eq(contactInfo.isActive, true)).orderBy(contactInfo.displayOrder);
  }
  async createContactInfo(contactData) {
    const [contact] = await db.insert(contactInfo).values(contactData).returning();
    return contact;
  }
  async updateContactInfo(id, contactData) {
    const [contact] = await db.update(contactInfo).set({ ...contactData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(contactInfo.id, id)).returning();
    return contact;
  }
  async deleteContactInfo(id) {
    await db.update(contactInfo).set({ isActive: false }).where(eq(contactInfo.id, id));
  }
  // Opening hours operations
  async getOpeningHours() {
    return await db.select().from(openingHours).where(eq(openingHours.isActive, true)).orderBy(openingHours.dayOfWeek);
  }
  async createOpeningHours(hoursData) {
    const [hours] = await db.insert(openingHours).values(hoursData).returning();
    return hours;
  }
  async updateOpeningHours(id, hoursData) {
    const [hours] = await db.update(openingHours).set({ ...hoursData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(openingHours.id, id)).returning();
    return hours;
  }
  async deleteOpeningHours(id) {
    await db.update(openingHours).set({ isActive: false }).where(eq(openingHours.id, id));
  }
  // Restaurant location operations
  async getRestaurantLocations() {
    return await db.select().from(restaurantLocations).where(eq(restaurantLocations.isActive, true)).orderBy(restaurantLocations.displayOrder);
  }
  async createRestaurantLocation(locationData) {
    const [location] = await db.insert(restaurantLocations).values(locationData).returning();
    return location;
  }
  async updateRestaurantLocation(id, locationData) {
    const [location] = await db.update(restaurantLocations).set({ ...locationData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(restaurantLocations.id, id)).returning();
    return location;
  }
  async deleteRestaurantLocation(id) {
    await db.update(restaurantLocations).set({ isActive: false }).where(eq(restaurantLocations.id, id));
  }
  // Floor plan elements operations
  async getFloorPlanElements() {
    return await db.select().from(floorPlanElements).where(eq(floorPlanElements.isActive, true)).orderBy(floorPlanElements.createdAt);
  }
  async getFloorPlanElement(id) {
    const [element] = await db.select().from(floorPlanElements).where(eq(floorPlanElements.id, id));
    return element;
  }
  async createFloorPlanElement(elementData) {
    const [element] = await db.insert(floorPlanElements).values(elementData).returning();
    return element;
  }
  async updateFloorPlanElement(id, elementData) {
    const [element] = await db.update(floorPlanElements).set({ ...elementData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(floorPlanElements.id, id)).returning();
    return element;
  }
  async deleteFloorPlanElement(id) {
    await db.update(floorPlanElements).set({ isActive: false }).where(eq(floorPlanElements.id, id));
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
var scryptAsync = promisify(scrypt);
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
function setupAuth(app2) {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  const sessionSettings = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !await comparePasswords(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/auth/register", async (req, res, next) => {
    try {
      const registrationSetting = await storage.getSystemSetting("registration_enabled");
      if (registrationSetting && registrationSetting.value === "false") {
        return res.status(403).json({ message: "Registration is currently disabled" });
      }
      const { email, password, firstName, lastName } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "admin"
        // All registered users are admins
      });
      console.log("Created user:", { id: user.id, email: user.email, role: user.role });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  app2.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user;
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  });
  app2.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
  app2.get("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
  app2.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;
    console.log("User in session:", { id: user.id, email: user.email, role: user.role });
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  });
}

// server/middleware.ts
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// server/routes.ts
import { z } from "zod";
function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/tables", async (req, res) => {
    try {
      const tables2 = await storage.getTables();
      res.json(tables2);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });
  app2.get("/api/menu/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching menu categories:", error);
      res.status(500).json({ message: "Failed to fetch menu categories" });
    }
  });
  app2.get("/api/menu/items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });
  app2.get("/api/bookings/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const bookings2 = await storage.getBookingsByDate(date);
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
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
  app2.get("/api/admin/bookings", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const bookings2 = await storage.getBookings();
      res.json(bookings2);
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  app2.patch("/api/admin/bookings/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const { id } = req.params;
      const { status } = req.body;
      if (!status || !["unconfirmed", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  app2.post("/api/admin/menu/categories", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.put("/api/admin/menu/categories/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/menu/categories/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.post("/api/admin/menu/items", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.put("/api/admin/menu/items/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/menu/items/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/admin/tables", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const tables2 = await storage.getAllTables();
      res.json(tables2);
    } catch (error) {
      console.error("Error fetching admin tables:", error);
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });
  app2.post("/api/admin/tables", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.patch("/api/admin/tables/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/tables/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.post("/api/admin/menu/categories", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.post("/api/admin/menu/items", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.post("/api/admin/gallery", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/contact", async (req, res) => {
    try {
      const contacts = await storage.getContactInfo();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      res.status(500).json({ message: "Failed to fetch contact info" });
    }
  });
  app2.post("/api/admin/contact", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.put("/api/admin/contact/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/contact/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/hours", async (req, res) => {
    try {
      const hours = await storage.getOpeningHours();
      res.json(hours);
    } catch (error) {
      console.error("Error fetching opening hours:", error);
      res.status(500).json({ message: "Failed to fetch opening hours" });
    }
  });
  app2.post("/api/admin/hours", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.put("/api/admin/hours/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/hours/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getRestaurantLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });
  app2.post("/api/admin/locations", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.put("/api/admin/locations/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.delete("/api/admin/locations/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.get("/api/admin/floor-plan-elements", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const elements = await storage.getFloorPlanElements();
      res.json(elements);
    } catch (error) {
      console.error("Error fetching floor plan elements:", error);
      res.status(500).json({ message: "Failed to fetch floor plan elements" });
    }
  });
  app2.post("/api/admin/floor-plan-elements", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
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
  app2.patch("/api/admin/floor-plan-elements/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const element = await storage.updateFloorPlanElement(req.params.id, req.body);
      res.json(element);
    } catch (error) {
      console.error("Error updating floor plan element:", error);
      res.status(500).json({ message: "Failed to update floor plan element" });
    }
  });
  app2.delete("/api/admin/floor-plan-elements/:id", requireAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      await storage.deleteFloorPlanElement(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting floor plan element:", error);
      res.status(500).json({ message: "Failed to delete floor plan element" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
