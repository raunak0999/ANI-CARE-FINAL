import { 
  petProfiles, 
  products, 
  careRecommendations, 
  trainingPrograms, 
  chatMessages,
  type PetProfile, 
  type InsertPetProfile,
  type Product,
  type InsertProduct,
  type CareRecommendation,
  type InsertCareRecommendation,
  type TrainingProgram,
  type InsertTrainingProgram,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Pet Profiles
  createPetProfile(profile: InsertPetProfile): Promise<PetProfile>;
  getPetProfile(id: number): Promise<PetProfile | undefined>;
  getAllPetProfiles(): Promise<PetProfile[]>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getRecommendedProducts(): Promise<Product[]>;
  
  // Care Recommendations
  createCareRecommendation(recommendation: InsertCareRecommendation): Promise<CareRecommendation>;
  getCareRecommendationsByPetId(petId: number): Promise<CareRecommendation[]>;
  
  // Training Programs
  getAllTrainingPrograms(): Promise<TrainingProgram[]>;
  getTrainingProgramsByAge(ageGroup: string): Promise<TrainingProgram[]>;
  
  // Chat Messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize sample data in database
    this.initializeData();
  }

  private async initializeData() {
    await this.initializeProducts();
    await this.initializeTrainingPrograms();
  }

  private async initializeProducts() {
    const productData: InsertProduct[] = [
      {
        name: "Premium Golden Retriever Food",
        description: "High-protein formula for adult dogs",
        price: 3999,
        category: "Food & Treats",
        imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isRecommended: true,
        rating: 5.0
      },
      {
        name: "Interactive Rope Toy",
        description: "Durable toy for medium to large dogs",
        price: 1599,
        category: "Toys & Accessories",
        imageUrl: "https://images.unsplash.com/photo-1605460375648-278bcbd579a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isBestseller: true,
        rating: 4.5
      },
      {
        name: "Professional Grooming Kit",
        description: "Complete set for double-coat breeds",
        price: 2799,
        category: "Grooming",
        imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isRecommended: true,
        rating: 5.0
      },
      {
        name: "Joint Health Supplements",
        description: "Natural support for active dogs",
        price: 2399,
        category: "Health & Medicine",
        imageUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isVetApproved: true,
        rating: 4.5
      },
      {
        name: "Organic Dog Treats",
        description: "All-natural training rewards",
        price: 1279,
        category: "Food & Treats",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isRecommended: true,
        rating: 4.8
      },
      {
        name: "Smart Water Bowl",
        description: "Automatic refilling with app control",
        price: 7199,
        category: "Toys & Accessories",
        imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isBestseller: true,
        rating: 4.7
      }
    ];

    try {
      // Check if products already exist
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length === 0) {
        await db.insert(products).values(productData);
      }
    } catch (error) {
      console.log("Products already initialized or error occurred:", error);
    }
  }

  private async initializeTrainingPrograms() {
    const trainingData: InsertTrainingProgram[] = [
      {
        title: "Basic Obedience",
        description: "Perfect for Golden Retrievers aged 1-3 years",
        ageGroup: "Young (1-3 years)",
        breedSuitability: ["Golden Retriever", "Labrador", "All Breeds"],
        tips: ["Sit, Stay, Come commands", "15-minute daily sessions", "Positive reinforcement techniques"],
        icon: "fas fa-graduation-cap",
        category: "obedience"
      },
      {
        title: "Exercise Routine",
        description: "High-energy breed specific activities",
        ageGroup: "Adult (3-7 years)",
        breedSuitability: ["Golden Retriever", "Labrador", "High-energy breeds"],
        tips: ["60+ minutes daily exercise", "Swimming, fetching, hiking", "Mental stimulation games"],
        icon: "fas fa-running",
        category: "exercise"
      },
      {
        title: "Behavioral Tips",
        description: "AI-analyzed breed-specific guidance",
        ageGroup: "All Ages",
        breedSuitability: ["All Breeds"],
        tips: ["Reduce excessive barking", "Prevent destructive chewing", "Socialization strategies"],
        icon: "fas fa-brain",
        category: "behavioral"
      },
      {
        title: "Puppy Foundation",
        description: "Essential training for young puppies",
        ageGroup: "Puppy (0-1 years)",
        breedSuitability: ["All Breeds"],
        tips: ["House training basics", "Crate training", "Basic socialization", "Bite inhibition"],
        icon: "fas fa-baby",
        category: "obedience"
      }
    ];

    try {
      // Check if training programs already exist
      const existingPrograms = await db.select().from(trainingPrograms).limit(1);
      if (existingPrograms.length === 0) {
        await db.insert(trainingPrograms).values(trainingData);
      }
    } catch (error) {
      console.log("Training programs already initialized or error occurred:", error);
    }
  }

  async createPetProfile(profile: InsertPetProfile): Promise<PetProfile> {
    const [petProfile] = await db
      .insert(petProfiles)
      .values(profile)
      .returning();
    return petProfile;
  }

  async getPetProfile(id: number): Promise<PetProfile | undefined> {
    const [petProfile] = await db.select().from(petProfiles).where(eq(petProfiles.id, id));
    return petProfile || undefined;
  }

  async getAllPetProfiles(): Promise<PetProfile[]> {
    return await db.select().from(petProfiles);
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getRecommendedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isRecommended, true));
  }

  async createCareRecommendation(recommendation: InsertCareRecommendation): Promise<CareRecommendation> {
    const [careRecommendation] = await db
      .insert(careRecommendations)
      .values(recommendation)
      .returning();
    return careRecommendation;
  }

  async getCareRecommendationsByPetId(petId: number): Promise<CareRecommendation[]> {
    return await db.select().from(careRecommendations).where(eq(careRecommendations.petProfileId, petId));
  }

  async getAllTrainingPrograms(): Promise<TrainingProgram[]> {
    return await db.select().from(trainingPrograms);
  }

  async getTrainingProgramsByAge(ageGroup: string): Promise<TrainingProgram[]> {
    const programs = await db.select().from(trainingPrograms);
    return programs.filter(program => 
      program.ageGroup === ageGroup || program.ageGroup === "All Ages"
    );
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }

  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
