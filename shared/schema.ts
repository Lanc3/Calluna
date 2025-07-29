import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("admin"), // customer, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tables = pgTable("tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  capacity: integer("capacity").notNull(),
  minCapacity: integer("min_capacity").default(1),
  maxCapacity: integer("max_capacity").default(8),
  tableType: varchar("table_type").default("standard"), // "standard", "booth", "high-top", "outdoor", "private"
  location: varchar("location").default("main"), // "main", "patio", "bar", "private-room"
  locationId: varchar("location_id").references(() => restaurantLocations.id),
  shape: varchar("shape").default("round"), // "round", "square", "rectangular"
  description: text("description"),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  width: integer("width").default(60), // in pixels for floor plan
  height: integer("height").default(60), // in pixels for floor plan
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false), // for special pricing or VIP tables
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const floorPlanElements = pgTable("floor_plan_elements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationId: varchar("location_id").notNull().references(() => restaurantLocations.id),
  elementType: varchar("element_type").notNull(), // 'bar', 'stairs', 'toilet', 'window', 'door', 'wall', 'kitchen'
  name: varchar("name").notNull(),
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  rotation: integer("rotation").default(0), // 0, 90, 180, 270 degrees
  color: varchar("color").default("#746899"), // Default purple color
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
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
  status: varchar("status").default("unconfirmed"), // unconfirmed, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuCategories = pgTable("menu_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => menuCategories.id),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  url: varchar("url").notNull(),
  alt: varchar("alt").notNull(),
  displayOrder: integer("display_order").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table for managing global settings
export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").unique().notNull(),
  value: text("value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact information table
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'phone', 'email', 'address', etc.
  label: varchar("label").notNull(),
  value: text("value").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Opening hours table
export const openingHours = pgTable("opening_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  dayName: varchar("day_name").notNull(),
  openTime: varchar("open_time"), // e.g., "17:00"
  closeTime: varchar("close_time"), // e.g., "23:00"
  isClosed: boolean("is_closed").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Restaurant locations table
export const restaurantLocations = pgTable("restaurant_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Table = typeof tables.$inferSelect;
export type InsertTable = typeof tables.$inferInsert;
export const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
  createdAt: true,
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = typeof menuCategories.$inferInsert;
export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
  createdAt: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;
export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;
export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
});

export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = typeof contactInfo.$inferInsert;
export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type OpeningHours = typeof openingHours.$inferSelect;
export type InsertOpeningHours = typeof openingHours.$inferInsert;
export const insertOpeningHoursSchema = createInsertSchema(openingHours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RestaurantLocation = typeof restaurantLocations.$inferSelect;
export type InsertRestaurantLocation = typeof restaurantLocations.$inferInsert;
export const insertRestaurantLocationSchema = createInsertSchema(restaurantLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FloorPlanElement = typeof floorPlanElements.$inferSelect;
export type InsertFloorPlanElement = typeof floorPlanElements.$inferInsert;
export const insertFloorPlanElementSchema = createInsertSchema(floorPlanElements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
