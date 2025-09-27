import { randomUUID } from "crypto";

// Database storage implementation using PostgreSQL (Disabled for local development)
export class DatabaseStorage {
  constructor() {
    // No seeding for disabled database storage
    console.log("Database storage class loaded (disabled for local development)");
  }

  async seedData() {
    // Database storage disabled - no seeding needed
    console.log("Database storage disabled - no seeding needed");
  }

  // All methods throw errors since database is disabled for local development
  async getUser(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async upsertUser(userData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async createSearch(searchData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getSearchById(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getSearchesByUser(userId, limit = 50) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getSearchHistory(userId, limit = 50) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async addToSearchHistory(userId, searchId) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getTrendingTopics(limit = 10) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async createTrendingTopic(topicData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async incrementTopicViews(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getTrendingTopicById(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getSpaces(limit = 10) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async createSpace(spaceData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getSpacesByCategory(category) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async createConversation(conversationData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getConversation(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getConversationsByUser(userId, limit = 50) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async updateConversation(id, updates) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getRecentConversations(limit = 50) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async deleteConversation(id) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async searchConversations(query, limit = 50) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async createMessage(messageData) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async getMessagesByConversation(conversationId) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
  }

  async deleteMessagesByConversation(conversationId) {
    throw new Error('Database storage is disabled. Use MemStorage instead.');
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