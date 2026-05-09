import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ----------------- TABLE DEFINITIONS ------------------

export const petProfiles = pgTable("pet_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(), // "Puppy (0-1 years)", etc.
  breed: text("breed").notNull(),
  size: text("size"), // Optional: "Small (0-25 lbs)", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  isRecommended: boolean("is_recommended").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isVetApproved: boolean("is_vet_approved").default(false),
  rating: real("rating").default(5.0),
});

export const careRecommendations = pgTable("care_recommendations", {
  id: serial("id").primaryKey(),
  petProfileId: integer("pet_profile_id").notNull(),
  category: text("category").notNull(), // "nutrition", "grooming", "health"
  title: text("title").notNull(),
  description: text("description").notNull(),
  tips: text("tips").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingPrograms = pgTable("training_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageGroup: text("age_group").notNull(),
  breedSuitability: text("breed_suitability").array(),
  tips: text("tips").array().notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // "obedience", "exercise", "behavioral"
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// ----------------- INSERT SCHEMAS (Zod) ------------------

// ✅ Updated to require non-empty strings for name, age, breed
export const insertPetProfileSchema = createInsertSchema(petProfiles, {
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  breed: z.string().min(1, "Breed is required"),
  size: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCareRecommendationSchema = createInsertSchema(careRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// ----------------- TYPES ------------------

export type PetProfile = typeof petProfiles.$inferSelect;
export type InsertPetProfile = z.infer<typeof insertPetProfileSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CareRecommendation = typeof careRecommendations.$inferSelect;
export type InsertCareRecommendation = z.infer<typeof insertCareRecommendationSchema>;

export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
