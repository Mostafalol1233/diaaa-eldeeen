import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, insertGameSchema, insertGameCardSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUserByEmail(req.session.userEmail);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.user = user;
    next();
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      req.session.userId = user.id;
      req.session.userEmail = user.email;
      
      res.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUserByEmail(req.session.userEmail);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
  });

  // Public routes
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const game = await storage.getGameWithCards(slug);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  app.get("/api/comments", async (req, res) => {
    try {
      const comments = await storage.getApprovedComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Admin routes
  app.get("/api/admin/comments", requireAuth, async (req, res) => {
    try {
      const comments = await storage.getAllComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.patch("/api/admin/comments/:id/approve", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comment = await storage.approveComment(id);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });

  app.delete("/api/admin/comments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteComment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      res.json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  app.post("/api/admin/games", requireAuth, async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.status(201).json(game);
    } catch (error) {
      res.status(400).json({ message: "Invalid game data" });
    }
  });

  app.patch("/api/admin/games/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gameData = insertGameSchema.partial().parse(req.body);
      const game = await storage.updateGame(id, gameData);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(400).json({ message: "Invalid game data" });
    }
  });

  app.delete("/api/admin/games/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGame(id);
      
      if (!success) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json({ message: "Game deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete game" });
    }
  });

  app.post("/api/admin/games/:gameId/cards", requireAuth, async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const cardData = insertGameCardSchema.parse({ ...req.body, gameId });
      const card = await storage.createGameCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ message: "Invalid card data" });
    }
  });

  app.patch("/api/admin/cards/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cardData = insertGameCardSchema.partial().parse(req.body);
      const card = await storage.updateGameCard(id, cardData);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json(card);
    } catch (error) {
      res.status(400).json({ message: "Invalid card data" });
    }
  });

  app.delete("/api/admin/cards/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGameCard(id);
      
      if (!success) {
        return res.status(404).json({ message: "Card not found" });
      }
      
      res.json({ message: "Card deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete card" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
