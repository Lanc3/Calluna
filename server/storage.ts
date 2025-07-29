import {
  users,
  tables,
  bookings,
  menuCategories,
  menuItems,
  galleryImages,
  systemSettings,
  contactInfo,
  openingHours,
  restaurantLocations,
  floorPlanElements,
  type User,
  type UpsertUser,
  type Table,
  type InsertTable,
  type Booking,
  type InsertBooking,
  type MenuCategory,
  type InsertMenuCategory,
  type MenuItem,
  type InsertMenuItem,
  type GalleryImage,
  type InsertGalleryImage,
  type SystemSetting,
  type InsertSystemSetting,
  type ContactInfo,
  type InsertContactInfo,
  type OpeningHours,
  type InsertOpeningHours,
  type RestaurantLocation,
  type InsertRestaurantLocation,
  type FloorPlanElement,
  type InsertFloorPlanElement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
  
  // Table operations
  getTables(): Promise<Table[]>;
  getAllTables(): Promise<Table[]>; // Admin access to all tables including inactive
  getTable(id: string): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: string, table: Partial<InsertTable>): Promise<Table>;
  deleteTable(id: string): Promise<void>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  deleteBooking(id: string): Promise<void>;
  
  // Menu operations
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuItems(): Promise<MenuItem[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: string, category: Partial<InsertMenuCategory>): Promise<MenuCategory>;
  deleteMenuCategory(id: string): Promise<void>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuCategory(id: string, category: Partial<InsertMenuCategory>): Promise<MenuCategory>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuCategory(id: string): Promise<void>;
  deleteMenuItem(id: string): Promise<void>;
  
  // Gallery operations
  getGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<void>;
  
  // System settings operations
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  setSystemSetting(key: string, value: string, description?: string): Promise<SystemSetting>;
  
  // Contact info operations
  getContactInfo(): Promise<ContactInfo[]>;
  createContactInfo(contact: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: string, contact: Partial<InsertContactInfo>): Promise<ContactInfo>;
  deleteContactInfo(id: string): Promise<void>;
  
  // Opening hours operations
  getOpeningHours(): Promise<OpeningHours[]>;
  createOpeningHours(hours: InsertOpeningHours): Promise<OpeningHours>;
  updateOpeningHours(id: string, hours: Partial<InsertOpeningHours>): Promise<OpeningHours>;
  deleteOpeningHours(id: string): Promise<void>;
  
  // Restaurant location operations
  getRestaurantLocations(): Promise<RestaurantLocation[]>;
  createRestaurantLocation(location: InsertRestaurantLocation): Promise<RestaurantLocation>;
  updateRestaurantLocation(id: string, location: Partial<InsertRestaurantLocation>): Promise<RestaurantLocation>;
  deleteRestaurantLocation(id: string): Promise<void>;
  
  // Floor plan elements operations
  getFloorPlanElements(): Promise<FloorPlanElement[]>;
  getFloorPlanElement(id: string): Promise<FloorPlanElement | undefined>;
  createFloorPlanElement(element: InsertFloorPlanElement): Promise<FloorPlanElement>;
  updateFloorPlanElement(id: string, element: Partial<InsertFloorPlanElement>): Promise<FloorPlanElement>;
  deleteFloorPlanElement(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  
  // Table operations
  async getTables(): Promise<Table[]> {
    return await db.select().from(tables).where(eq(tables.isActive, true));
  }
  
  async getAllTables(): Promise<Table[]> {
    return await db.select().from(tables); // Return all tables for admin management
  }
  
  async getTable(id: string): Promise<Table | undefined> {
    const [table] = await db.select().from(tables).where(eq(tables.id, id));
    return table;
  }
  
  async createTable(table: InsertTable): Promise<Table> {
    const [newTable] = await db.insert(tables).values(table).returning();
    return newTable;
  }
  
  async updateTable(id: string, table: Partial<InsertTable>): Promise<Table> {
    const [updatedTable] = await db.update(tables).set(table).where(eq(tables.id, id)).returning();
    return updatedTable;
  }
  
  async deleteTable(id: string): Promise<void> {
    await db.update(tables).set({ isActive: false }).where(eq(tables.id, id));
  }
  
  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
  
  async getBookingsByDate(date: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(
      and(eq(bookings.date, date), eq(bookings.status, "confirmed"))
    );
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }
  
  async updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking> {
    const [updatedBooking] = await db.update(bookings).set(booking).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const [updatedBooking] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return updatedBooking;
  }
  
  async deleteBooking(id: string): Promise<void> {
    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id));
  }
  
  // Menu operations
  async getMenuCategories(): Promise<MenuCategory[]> {
    return await db.select().from(menuCategories).where(eq(menuCategories.isActive, true)).orderBy(menuCategories.displayOrder);
  }
  
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.isActive, true)).orderBy(menuItems.displayOrder);
  }
  
  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(
      and(eq(menuItems.categoryId, categoryId), eq(menuItems.isActive, true))
    );
  }
  
  async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
    const [newCategory] = await db.insert(menuCategories).values(category).returning();
    return newCategory;
  }
  
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }
  
  async updateMenuCategory(id: string, category: Partial<InsertMenuCategory>): Promise<MenuCategory> {
    const [updatedCategory] = await db.update(menuCategories).set(category).where(eq(menuCategories.id, id)).returning();
    return updatedCategory;
  }
  
  async updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [updatedItem] = await db.update(menuItems).set(item).where(eq(menuItems.id, id)).returning();
    return updatedItem;
  }
  
  async deleteMenuCategory(id: string): Promise<void> {
    await db.update(menuCategories).set({ isActive: false }).where(eq(menuCategories.id, id));
  }
  
  async deleteMenuItem(id: string): Promise<void> {
    await db.update(menuItems).set({ isActive: false }).where(eq(menuItems.id, id));
  }
  
  // Gallery operations
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.isActive, true));
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db.insert(galleryImages).values(image).returning();
    return newImage;
  }
  
  async updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [updatedImage] = await db.update(galleryImages).set(image).where(eq(galleryImages.id, id)).returning();
    return updatedImage;
  }
  
  async deleteGalleryImage(id: string): Promise<void> {
    await db.update(galleryImages).set({ isActive: false }).where(eq(galleryImages.id, id));
  }

  // System settings operations
  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }

  async setSystemSetting(key: string, value: string, description?: string): Promise<SystemSetting> {
    const existing = await this.getSystemSetting(key);
    if (existing) {
      const [updated] = await db.update(systemSettings)
        .set({ value, description, updatedAt: new Date() })
        .where(eq(systemSettings.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(systemSettings)
        .values({ key, value, description })
        .returning();
      return created;
    }
  }

  // Contact info operations
  async getContactInfo(): Promise<ContactInfo[]> {
    return await db.select().from(contactInfo)
      .where(eq(contactInfo.isActive, true))
      .orderBy(contactInfo.displayOrder);
  }

  async createContactInfo(contactData: InsertContactInfo): Promise<ContactInfo> {
    const [contact] = await db.insert(contactInfo).values(contactData).returning();
    return contact;
  }

  async updateContactInfo(id: string, contactData: Partial<InsertContactInfo>): Promise<ContactInfo> {
    const [contact] = await db.update(contactInfo)
      .set({ ...contactData, updatedAt: new Date() })
      .where(eq(contactInfo.id, id))
      .returning();
    return contact;
  }

  async deleteContactInfo(id: string): Promise<void> {
    await db.update(contactInfo)
      .set({ isActive: false })
      .where(eq(contactInfo.id, id));
  }

  // Opening hours operations
  async getOpeningHours(): Promise<OpeningHours[]> {
    return await db.select().from(openingHours)
      .where(eq(openingHours.isActive, true))
      .orderBy(openingHours.dayOfWeek);
  }

  async createOpeningHours(hoursData: InsertOpeningHours): Promise<OpeningHours> {
    const [hours] = await db.insert(openingHours).values(hoursData).returning();
    return hours;
  }

  async updateOpeningHours(id: string, hoursData: Partial<InsertOpeningHours>): Promise<OpeningHours> {
    const [hours] = await db.update(openingHours)
      .set({ ...hoursData, updatedAt: new Date() })
      .where(eq(openingHours.id, id))
      .returning();
    return hours;
  }

  async deleteOpeningHours(id: string): Promise<void> {
    await db.update(openingHours)
      .set({ isActive: false })
      .where(eq(openingHours.id, id));
  }

  // Restaurant location operations
  async getRestaurantLocations(): Promise<RestaurantLocation[]> {
    return await db.select().from(restaurantLocations)
      .where(eq(restaurantLocations.isActive, true))
      .orderBy(restaurantLocations.displayOrder);
  }

  async createRestaurantLocation(locationData: InsertRestaurantLocation): Promise<RestaurantLocation> {
    const [location] = await db.insert(restaurantLocations).values(locationData).returning();
    return location;
  }

  async updateRestaurantLocation(id: string, locationData: Partial<InsertRestaurantLocation>): Promise<RestaurantLocation> {
    const [location] = await db.update(restaurantLocations)
      .set({ ...locationData, updatedAt: new Date() })
      .where(eq(restaurantLocations.id, id))
      .returning();
    return location;
  }

  async deleteRestaurantLocation(id: string): Promise<void> {
    await db.update(restaurantLocations)
      .set({ isActive: false })
      .where(eq(restaurantLocations.id, id));
  }

  // Floor plan elements operations
  async getFloorPlanElements(): Promise<FloorPlanElement[]> {
    return await db.select().from(floorPlanElements)
      .where(eq(floorPlanElements.isActive, true))
      .orderBy(floorPlanElements.createdAt);
  }

  async getFloorPlanElement(id: string): Promise<FloorPlanElement | undefined> {
    const [element] = await db.select().from(floorPlanElements).where(eq(floorPlanElements.id, id));
    return element;
  }

  async createFloorPlanElement(elementData: InsertFloorPlanElement): Promise<FloorPlanElement> {
    const [element] = await db.insert(floorPlanElements).values(elementData).returning();
    return element;
  }

  async updateFloorPlanElement(id: string, elementData: Partial<InsertFloorPlanElement>): Promise<FloorPlanElement> {
    const [element] = await db.update(floorPlanElements)
      .set({ ...elementData, updatedAt: new Date() })
      .where(eq(floorPlanElements.id, id))
      .returning();
    return element;
  }

  async deleteFloorPlanElement(id: string): Promise<void> {
    await db.update(floorPlanElements)
      .set({ isActive: false })
      .where(eq(floorPlanElements.id, id));
  }
}

export const storage = new DatabaseStorage();
