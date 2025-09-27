import {
  users,
  searches,
  trendingTopics,
  spaces,
  searchHistory,
  conversations,
  messages,
} from "../shared/schema.js";
import { db } from "./db.js";
import { randomUUID } from "crypto";
import { eq, desc, and, like, or } from "drizzle-orm";

// Database storage implementation using PostgreSQL (Disabled for local development)
export class DatabaseStorage {
  constructor() {
    this.seedData();
  }

  async seedData() {
    try {
      // Check if trending topics exist
      const existingTopics = await db.select().from(trendingTopics).limit(1);
      if (existingTopics.length > 0) {
        return; // Data already seeded
      }

      // Seed trending topics
      const topics = [
        {
          title: "Latest AI Breakthroughs in 2024",
          description: "Discover the most significant AI developments this year",
          category: "Technology",
          readTime: "2 min read",
          icon: "fas fa-fire",
          viewCount: 1250,
          isActive: true,
        },
        {
          title: "Sustainable Investment Strategies",
          description: "How to build an eco-friendly investment portfolio",
          category: "Finance",
          readTime: "4 min read",
          icon: "fas fa-leaf",
          viewCount: 890,
          isActive: true,
        },
        {
          title: "Hidden Gems in Southeast Asia",
          description: "Off-the-beaten-path destinations for adventurous travelers",
          category: "Travel",
          readTime: "6 min read",
          icon: "fas fa-map-marked-alt",
          viewCount: 567,
          isActive: true,
        },
        {
          title: "Quantum Computing Fundamentals",
          description: "Understanding the basics of quantum computation",
          category: "Academic",
          readTime: "8 min read",
          icon: "fas fa-graduation-cap",
          viewCount: 432,
          isActive: true,
        },
        {
          title: "Best Tech Deals This Week",
          description: "Top technology products with significant discounts",
          category: "Shopping",
          readTime: "3 min read",
          icon: "fas fa-shopping-cart",
          viewCount: 1120,
          isActive: true,
        },
        {
          title: "Mental Health in Remote Work",
          description: "Strategies for maintaining wellbeing while working from home",
          category: "Health",
          readTime: "5 min read",
          icon: "fas fa-heartbeat",
          viewCount: 678,
          isActive: true,
        },
      ];

      await db.insert(trendingTopics).values(topics);

      // Seed spaces
      const spacesData = [
        {
          title: "Business Strategy",
          description: "Market analysis, competitive research, and business planning",
          category: "Business",
          templateCount: 12,
          icon: "fas fa-briefcase",
          gradient: "from-blue-500 to-purple-600",
          tags: ["SWOT Analysis", "Market Research"],
          isActive: true,
        },
        {
          title: "Developer Tools",
          description: "Code review, debugging, and technical documentation",
          category: "Technology",
          templateCount: 8,
          icon: "fas fa-code",
          gradient: "from-green-500 to-teal-600",
          tags: ["Code Review", "Documentation"],
          isActive: true,
        },
        {
          title: "Creative Writing",
          description: "Content creation, storytelling, and copywriting assistance",
          category: "Creative",
          templateCount: 15,
          icon: "fas fa-pen-fancy",
          gradient: "from-orange-500 to-red-600",
          tags: ["Blog Posts", "Marketing Copy"],
          isActive: true,
        },
      ];

      await db.insert(spaces).values(spacesData);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  async upsertUser(userData) {
    try {
      // Try to find existing user
      const existingUser = await this.getUser(userData.id);
      
      if (existingUser) {
        // Update existing user
        const updated = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return updated[0];
      } else {
        // Create new user
        const newUser = await db
          .insert(users)
          .values({
            ...userData,
            id: userData.id || randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        return newUser[0];
      }
    } catch (error) {
      console.error("Error upserting user:", error);
      throw error;
    }
  }

  // Search operations
  async createSearch(searchData) {
    const result = await db
      .insert(searches)
      .values({
        ...searchData,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getSearchById(id) {
    const result = await db.select().from(searches).where(eq(searches.id, id)).limit(1);
    return result[0] || null;
  }

  async getSearchesByUser(userId, limit = 50) {
    const result = await db
      .select()
      .from(searches)
      .where(eq(searches.userId, userId))
      .orderBy(desc(searches.createdAt))
      .limit(limit);
    return result;
  }

  async getSearchHistory(userId, limit = 50) {
    const result = await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
    return result;
  }

  async addToSearchHistory(userId, searchId) {
    const result = await db
      .insert(searchHistory)
      .values({
        userId,
        searchId,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  }

  // Trending topics operations
  async getTrendingTopics(limit = 10) {
    const result = await db
      .select()
      .from(trendingTopics)
      .where(eq(trendingTopics.isActive, true))
      .orderBy(desc(trendingTopics.viewCount))
      .limit(limit);
    return result;
  }

  async createTrendingTopic(topicData) {
    const result = await db
      .insert(trendingTopics)
      .values({
        ...topicData,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async incrementTopicViews(id) {
    const topic = await this.getTrendingTopicById(id);
    if (topic) {
      await db
        .update(trendingTopics)
        .set({
          viewCount: (topic.viewCount || 0) + 1,
        })
        .where(eq(trendingTopics.id, id));
    }
  }

  async getTrendingTopicById(id) {
    const result = await db.select().from(trendingTopics).where(eq(trendingTopics.id, id)).limit(1);
    return result[0] || null;
  }

  // Spaces operations
  async getSpaces(limit = 10) {
    const result = await db
      .select()
      .from(spaces)
      .where(eq(spaces.isActive, true))
      .orderBy(spaces.createdAt)
      .limit(limit);
    return result;
  }

  async createSpace(spaceData) {
    const result = await db
      .insert(spaces)
      .values({
        ...spaceData,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getSpacesByCategory(category) {
    const result = await db
      .select()
      .from(spaces)
      .where(and(eq(spaces.isActive, true), eq(spaces.category, category)));
    return result;
  }

  // Conversation operations
  async createConversation(conversationData) {
    const result = await db
      .insert(conversations)
      .values({
        ...conversationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getConversation(id) {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0] || null;
  }

  async getConversationsByUser(userId, limit = 50) {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt))
      .limit(limit);
    return result;
  }

  async updateConversation(id, updates) {
    const result = await db
      .update(conversations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();
    
    if (result.length === 0) {
      throw new Error('Conversation not found');
    }
    return result[0];
  }

  async getRecentConversations(limit = 50) {
    const result = await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.updatedAt))
      .limit(limit);
    return result;
  }

  async deleteConversation(id) {
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async searchConversations(query, limit = 50) {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const result = await db
      .select()
      .from(conversations)
      .where(
        or(
          like(db.raw('LOWER(title)'), lowerQuery),
          like(db.raw('LOWER(summary)'), lowerQuery)
        )
      )
      .orderBy(desc(conversations.updatedAt))
      .limit(limit);
    return result;
  }

  // Message operations
  async createMessage(messageData) {
    const result = await db
      .insert(messages)
      .values({
        ...messageData,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async getMessagesByConversation(conversationId) {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
    return result;
  }

  async deleteMessagesByConversation(conversationId) {
    await db.delete(messages).where(eq(messages.conversationId, conversationId));
  }
}

export class MemStorage {
  constructor() {
    this.users = new Map();
    this.searches = new Map();
    this.trendingTopics = new Map();
    this.spaces = new Map();
    this.searchHistoryRecords = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    
    this.seedData();
  }

  seedData() {
    // Seed trending topics
    const topics = [
      {
        title: "Latest AI Breakthroughs in 2024",
        description: "Discover the most significant AI developments this year",
        category: "Technology",
        readTime: "2 min read",
        icon: "fas fa-fire",
        viewCount: 1250,
        isActive: true,
      },
      {
        title: "Sustainable Investment Strategies",
        description: "How to build an eco-friendly investment portfolio",
        category: "Finance",
        readTime: "4 min read",
        icon: "fas fa-leaf",
        viewCount: 890,
        isActive: true,
      },
      {
        title: "Hidden Gems in Southeast Asia",
        description: "Off-the-beaten-path destinations for adventurous travelers",
        category: "Travel",
        readTime: "6 min read",
        icon: "fas fa-map-marked-alt",
        viewCount: 567,
        isActive: true,
      },
      {
        title: "Quantum Computing Fundamentals",
        description: "Understanding the basics of quantum computation",
        category: "Academic",
        readTime: "8 min read",
        icon: "fas fa-graduation-cap",
        viewCount: 432,
        isActive: true,
      },
      {
        title: "Best Tech Deals This Week",
        description: "Top technology products with significant discounts",
        category: "Shopping",
        readTime: "3 min read",
        icon: "fas fa-shopping-cart",
        viewCount: 1120,
        isActive: true,
      },
      {
        title: "Mental Health in Remote Work",
        description: "Strategies for maintaining wellbeing while working from home",
        category: "Health",
        readTime: "5 min read",
        icon: "fas fa-heartbeat",
        viewCount: 678,
        isActive: true,
      },
    ];

    topics.forEach((topic) => {
      const id = randomUUID();
      this.trendingTopics.set(id, {
        ...topic,
        id,
        createdAt: new Date(),
      });
    });

    // Seed spaces
    const spacesData = [
      {
        title: "Business Strategy",
        description: "Market analysis, competitive research, and business planning",
        category: "Business",
        templateCount: 12,
        icon: "fas fa-briefcase",
        gradient: "from-blue-500 to-purple-600",
        tags: ["SWOT Analysis", "Market Research"],
        isActive: true,
      },
      {
        title: "Developer Tools",
        description: "Code review, debugging, and technical documentation",
        category: "Technology",
        templateCount: 8,
        icon: "fas fa-code",
        gradient: "from-green-500 to-teal-600",
        tags: ["Code Review", "Documentation"],
        isActive: true,
      },
      {
        title: "Creative Writing",
        description: "Content creation, storytelling, and copywriting assistance",
        category: "Creative",
        templateCount: 15,
        icon: "fas fa-pen-fancy",
        gradient: "from-orange-500 to-red-600",
        tags: ["Blog Posts", "Marketing Copy"],
        isActive: true,
      },
    ];

    spacesData.forEach((space) => {
      const id = randomUUID();
      this.spaces.set(id, {
        ...space,
        id,
        createdAt: new Date(),
      });
    });
  }

  // User operations
  async getUser(id) {
    return this.users.get(id);
  }

  async upsertUser(userData) {
    const existingUser = Array.from(this.users.values()).find(u => u.id === userData.id);
    
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const user = {
        ...userData,
        id: userData.id || randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(user.id, user);
      return user;
    }
  }

  // Search operations
  async createSearch(searchData) {
    const id = randomUUID();
    const search = {
      ...searchData,
      id,
      createdAt: new Date(),
    };
    this.searches.set(id, search);
    return search;
  }

  async getSearchById(id) {
    return this.searches.get(id);
  }

  async getSearchesByUser(userId, limit = 50) {
    return Array.from(this.searches.values())
      .filter(search => search.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getSearchHistory(userId, limit = 50) {
    return Array.from(this.searchHistoryRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async addToSearchHistory(userId, searchId) {
    const id = randomUUID();
    const record = {
      id,
      userId,
      searchId,
      createdAt: new Date(),
    };
    this.searchHistoryRecords.set(id, record);
    return record;
  }

  // Trending topics operations
  async getTrendingTopics(limit = 10) {
    return Array.from(this.trendingTopics.values())
      .filter(topic => topic.isActive)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  }

  async createTrendingTopic(topicData) {
    const id = randomUUID();
    const topic = {
      ...topicData,
      id,
      createdAt: new Date(),
    };
    this.trendingTopics.set(id, topic);
    return topic;
  }

  async incrementTopicViews(id) {
    const topic = this.trendingTopics.get(id);
    if (topic) {
      topic.viewCount = (topic.viewCount || 0) + 1;
      this.trendingTopics.set(id, topic);
    }
  }

  // Spaces operations
  async getSpaces(limit = 10) {
    return Array.from(this.spaces.values())
      .filter(space => space.isActive)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createSpace(spaceData) {
    const id = randomUUID();
    const space = {
      ...spaceData,
      id,
      createdAt: new Date(),
    };
    this.spaces.set(id, space);
    return space;
  }

  async getSpacesByCategory(category) {
    return Array.from(this.spaces.values())
      .filter(space => space.isActive && space.category === category);
  }

  // Conversation operations
  async createConversation(conversationData) {
    const id = randomUUID();
    const conversation = {
      ...conversationData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id) {
    return this.conversations.get(id);
  }

  async getConversationsByUser(userId, limit = 50) {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async updateConversation(id, updates) {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    const updated = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async getRecentConversations(limit = 50) {
    return Array.from(this.conversations.values())
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async deleteConversation(id) {
    this.conversations.delete(id);
  }

  async searchConversations(query, limit = 50) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.conversations.values())
      .filter(conv => 
        conv.title?.toLowerCase().includes(lowerQuery) ||
        conv.summary?.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))
      .slice(0, limit);
  }

  // Message operations
  async createMessage(messageData) {
    const id = randomUUID();
    const message = {
      ...messageData,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesByConversation(conversationId) {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async deleteMessagesByConversation(conversationId) {
    const messageIds = Array.from(this.messages.entries())
      .filter(([_, msg]) => msg.conversationId === conversationId)
      .map(([id, _]) => id);
    
    messageIds.forEach(id => this.messages.delete(id));
  }
}

export const storage = new MemStorage();