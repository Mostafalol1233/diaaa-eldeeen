import { 
  users, games, gameCards, comments,
  type User, type InsertUser,
  type Game, type InsertGame, type GameWithCards,
  type GameCard, type InsertGameCard,
  type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Game methods
  getGames(): Promise<Game[]>;
  getAllGames(): Promise<Game[]>; // For admin - includes inactive games
  getGame(id: number): Promise<Game | undefined>;
  getGameBySlug(slug: string): Promise<Game | undefined>;
  getGameWithCards(slug: string): Promise<GameWithCards | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;

  // Game card methods
  getGameCards(gameId: number): Promise<GameCard[]>;
  createGameCard(card: InsertGameCard): Promise<GameCard>;
  updateGameCard(id: number, card: Partial<InsertGameCard>): Promise<GameCard | undefined>;
  deleteGameCard(id: number): Promise<boolean>;

  // Comment methods
  getApprovedComments(): Promise<Comment[]>;
  getAllComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: number): Promise<Comment | undefined>;
  deleteComment(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Game methods
  async getGames(): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.isActive, true)).orderBy(games.name);
  }

  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games).orderBy(games.name);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async getGameBySlug(slug: string): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.slug, slug));
    return game || undefined;
  }

  async getGameWithCards(slug: string): Promise<GameWithCards | undefined> {
    const game = await this.getGameBySlug(slug);
    if (!game) return undefined;

    const cards = await db
      .select()
      .from(gameCards)
      .where(and(eq(gameCards.gameId, game.id), eq(gameCards.isActive, true)))
      .orderBy(gameCards.price);

    return { ...game, cards };
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame)
      .returning();
    return game;
  }

  async updateGame(id: number, updateData: Partial<InsertGame>): Promise<Game | undefined> {
    const [game] = await db
      .update(games)
      .set(updateData)
      .where(eq(games.id, id))
      .returning();
    return game || undefined;
  }

  async deleteGame(id: number): Promise<boolean> {
    const result = await db.delete(games).where(eq(games.id, id));
    return result.rowCount > 0;
  }

  // Game card methods
  async getGameCards(gameId: number): Promise<GameCard[]> {
    return await db
      .select()
      .from(gameCards)
      .where(and(eq(gameCards.gameId, gameId), eq(gameCards.isActive, true)))
      .orderBy(gameCards.price);
  }

  async createGameCard(insertCard: InsertGameCard): Promise<GameCard> {
    const [card] = await db
      .insert(gameCards)
      .values(insertCard)
      .returning();
    return card;
  }

  async updateGameCard(id: number, updateData: Partial<InsertGameCard>): Promise<GameCard | undefined> {
    const [card] = await db
      .update(gameCards)
      .set(updateData)
      .where(eq(gameCards.id, id))
      .returning();
    return card || undefined;
  }

  async deleteGameCard(id: number): Promise<boolean> {
    const result = await db.delete(gameCards).where(eq(gameCards.id, id));
    return result.rowCount > 0;
  }

  // Comment methods
  async getApprovedComments(): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.isApproved, true))
      .orderBy(desc(comments.createdAt));
  }

  async getAllComments(): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async approveComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db
      .update(comments)
      .set({ isApproved: true })
      .where(eq(comments.id, id))
      .returning();
    return comment || undefined;
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
