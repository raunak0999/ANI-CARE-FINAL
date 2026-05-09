import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPetProfileSchema,
  insertChatMessageSchema,
  type PetProfile,
  type CareRecommendationGroup,
} from "@shared/schema";
import {
  generateCareRecommendations,
  generateChatResponse,
} from "./services/openai";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 🔥 Store last profile in memory for context
let lastPetProfile: PetProfile | null = null;
let lastRecommendations: CareRecommendationGroup | null = null;

// --- Reels in-memory store ---
interface Reel {
  id: number;
  filename: string;
  caption: string;
  uploaderName: string;
  uploadedAt: string;
}
const reelsStore: Reel[] = [];
let reelIdCounter = 1;

// --- Multer setup ---
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `reel-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("✅ Routes are registering...");

  // --- Serve uploaded files ---
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadsDir, path.basename(req.path));
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    return res.status(404).json({ message: "File not found" });
  });

  // 🐶 Pet Profile Route (POST)
  app.post("/api/pet-profiles", async (req, res) => {
    try {
      console.log("👉 Incoming pet profile body:", req.body);

      const validatedData = insertPetProfileSchema.parse(req.body);
      console.log("✅ Validated data:", validatedData);

      const petProfile: PetProfile = {
        id: Date.now(),
        ...validatedData,
      };

      lastPetProfile = petProfile;

      // Optionally use AI to generate smart recommendations here
      const recommendations = await generateCareRecommendations(
        petProfile.name,
        petProfile.age,
        petProfile.breed,
        petProfile.size
      );

      lastRecommendations = recommendations;

      try {
        await storage.saveRecommendations(petProfile.id, recommendations);
      } catch (err: any) {
        console.warn("⚠️ Could not save recommendations:", err.message);
      }

      return res.json({
        profile: petProfile,
        recommendations,
      });
    } catch (err: any) {
      console.error("❌ Profile creation error:", err);
      return res.status(400).json({
        message: "Invalid pet profile data",
        error: err?.message || err,
      });
    }
  });

  // ✅ Pet Profile Route (GET)
  app.get("/api/pet-profiles", async (req, res) => {
    if (!lastPetProfile || !lastRecommendations) {
      return res.status(404).json({ message: "No profile found" });
    }

    return res.json({
      profile: lastPetProfile,
      recommendations: lastRecommendations,
    });
  });

  // 💬 Chat Message Route (with context + DB save)
  app.post("/api/chat", async (req, res) => {
    try {
      console.log("📩 Incoming chat request:", req.body);

      const validatedData = insertChatMessageSchema.parse(req.body);
      console.log("✅ Validated chat message:", validatedData);

      const petContext = lastPetProfile
        ? `Pet Name: ${lastPetProfile.name}, Age: ${lastPetProfile.age}, Breed: ${lastPetProfile.breed}, Size: ${lastPetProfile.size ?? "N/A"}`
        : undefined;

      const reply = await generateChatResponse(validatedData.message, petContext);

      // ✅ Save to DB
      try {
        await storage.saveChatMessage({
          sessionId: validatedData.sessionId,
          message: validatedData.message,
          response: reply,
        });
      } catch (err: any) {
        console.warn("⚠️ Could not save chat message:", err.message);
      }

      return res.json({ response: reply });
    } catch (err: any) {
      console.error("❌ Chat error:", err);
      return res.status(400).json({
        message: "Invalid chat message",
        error: err?.message || err,
      });
    }
  });

  // 💬 Chat Messages (save history)
  app.post("/api/chat-messages", async (req, res) => {
    try {
      const { sessionId, message, response } = req.body;
      if (!sessionId || !message || !response) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      try {
        await storage.saveChatMessage({ sessionId, message, response });
      } catch (err: any) {
        console.warn("⚠️ Could not save chat message:", err.message);
      }
      return res.json({ success: true });
    } catch (err: any) {
      console.error("❌ Chat messages error:", err);
      return res.status(400).json({ message: "Error saving chat message" });
    }
  });

  // 🛍️ Product Listing Route — 8 products across 4 categories
  app.get("/api/products", (req, res) => {
    const sampleProducts = [
      {
        id: 1,
        name: "Chicken Biscuits",
        description: "Delicious chicken-flavored treats for your furry friend.",
        price: 299,
        imageUrl: "/products/chicken-biscuits.png",
        rating: 4.5,
        isRecommended: true,
        isBestseller: false,
        isVetApproved: true,
        category: "Food & Treats",
      },
      {
        id: 2,
        name: "Squeaky Toy Bone",
        description: "Fun squeaky toy bone for hours of play.",
        price: 199,
        imageUrl: "/products/squeaky-toy-bone.png",
        rating: 4,
        isRecommended: false,
        isBestseller: true,
        isVetApproved: false,
        category: "Toys & Accessories",
      },
      {
        id: 3,
        name: "Joint Health Supplements",
        description: "Veterinary-approved supplements for joint care.",
        price: 599,
        imageUrl: "/products/joint-supplements.png",
        rating: 4.8,
        isRecommended: true,
        isBestseller: false,
        isVetApproved: true,
        category: "Health & Medicine",
      },
      {
        id: 4,
        name: "Grooming Comb Set",
        description: "Professional grooming set for all coat types.",
        price: 449,
        imageUrl: "/products/grooming-comb-set.png",
        rating: 4.3,
        isRecommended: false,
        isBestseller: true,
        isVetApproved: false,
        category: "Grooming",
      },
      {
        id: 5,
        name: "Premium Dry Food",
        description: "High-protein dry food for adult dogs with real chicken.",
        price: 899,
        imageUrl: "/products/premium-dry-food.png",
        rating: 4.7,
        isRecommended: true,
        isBestseller: true,
        isVetApproved: true,
        category: "Food & Treats",
      },
      {
        id: 6,
        name: "Interactive Cat Toy",
        description: "Feather wand toy that keeps cats entertained for hours.",
        price: 249,
        imageUrl: "/products/interactive-cat-toy.png",
        rating: 4.4,
        isRecommended: false,
        isBestseller: true,
        isVetApproved: false,
        category: "Toys & Accessories",
      },
      {
        id: 7,
        name: "Organic Pet Shampoo",
        description: "Gentle, organic shampoo for sensitive skin pets.",
        price: 349,
        imageUrl: "/products/organic-pet-shampoo.png",
        rating: 4.6,
        isRecommended: true,
        isBestseller: false,
        isVetApproved: true,
        category: "Grooming",
      },
      {
        id: 8,
        name: "Detangling Brush",
        description: "Ergonomic detangling brush for medium to long fur.",
        price: 179,
        imageUrl: "/products/detangling-brush.png",
        rating: 4.2,
        isRecommended: false,
        isBestseller: false,
        isVetApproved: true,
        category: "Grooming",
      },
    ];

    const { category } = req.query;

    if (category && category !== "all") {
      const filtered = sampleProducts.filter(
        (product) => product.category === category
      );
      return res.json(filtered);
    }

    return res.json(sampleProducts);
  });

  // 🎬 Reels Routes
  app.post("/api/reels", upload.single("video"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const caption = (req.body.caption as string) || "";
      const uploaderName = (req.body.uploaderName as string) || "Anonymous";

      const reel: Reel = {
        id: reelIdCounter++,
        filename: req.file.filename,
        caption,
        uploaderName,
        uploadedAt: new Date().toISOString(),
      };

      reelsStore.push(reel);
      return res.json(reel);
    } catch (err: any) {
      console.error("❌ Reel upload error:", err);
      return res.status(500).json({ message: "Failed to upload reel" });
    }
  });

  app.get("/api/reels", (_req, res) => {
    // Return newest first
    const sorted = [...reelsStore].reverse();
    return res.json(sorted);
  });

  return createServer(app);
}
