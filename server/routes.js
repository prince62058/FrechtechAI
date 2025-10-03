import { createServer } from "http";
import { storage } from "./storage.js";
import { generateAIResponse, generateSearchSuggestions } from "./openai.js";
import { insertSearchSchema, insertConversationSchema, insertMessageSchema, signupSchema, loginSchema } from "../shared/schema.js";
import { generateToken, hashPassword, comparePassword, authMiddleware, optionalAuth } from "./auth.js";

export async function registerRoutes(app) {
  // Initialize database if needed
  if (storage.initialize) {
    await storage.initialize();
  }

  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const { email, password, firstName, lastName } = validatedData;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await hashPassword(password);
      
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.get('/api/auth/user', authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user' });
    }
  });

  // Search routes
  app.post('/api/search', async (req, res) => {
    try {
      const { query, category } = req.body;

      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      console.log(`Processing search query: "${query}" with category: ${category}`);

      const aiResponse = await generateAIResponse(query, category);
      console.log(`AI response generated:`, { 
        contentLength: aiResponse.content?.length || 0, 
        sourcesCount: aiResponse.sources?.length || 0 
      });

      // Ensure we have a valid response
      if (!aiResponse.content) {
        console.warn("No AI content generated, using fallback");
        aiResponse.content = `I apologize, but I wasn't able to generate a response for "${query}". This might be due to configuration issues with the AI services. Please check the server logs or try again later.`;
      }

      const search = await storage.createSearch({
        query,
        response: aiResponse.content,
        category: category || null,
        sources: aiResponse.sources,
        userId: null,
      });

      res.json({
        searchId: search._id,
        query,
        response: aiResponse.content,
        sources: aiResponse.sources || [],
        category: category || null,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  app.get('/api/search/suggestions', async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.json({ suggestions: [] });
      }

      const suggestions = await generateSearchSuggestions(q);
      res.json({ suggestions });
    } catch (error) {
      console.error("Suggestions error:", error);
      res.json({ suggestions: [] });
    }
  });

  app.get('/api/search/:id', async (req, res) => {
    try {
      const search = await storage.getSearchById(req.params.id);
      if (!search) {
        return res.status(404).json({ message: "Search not found" });
      }
      res.json(search);
    } catch (error) {
      console.error("Get search error:", error);
      res.status(500).json({ message: "Failed to get search" });
    }
  });

  // Trending topics routes
  app.get('/api/trending', async (req, res) => {
    try {
      const topics = await storage.getTrendingTopics(10);
      res.json(topics);
    } catch (error) {
      console.error("Get trending topics error:", error);
      res.status(500).json({ message: "Failed to get trending topics" });
    }
  });

  app.post('/api/trending/:id/view', async (req, res) => {
    try {
      await storage.incrementTopicViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Increment topic views error:", error);
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Spaces routes
  app.get('/api/spaces', async (req, res) => {
    try {
      const { category } = req.query;
      let spaces;

      if (category && typeof category === 'string') {
        spaces = await storage.getSpacesByCategory(category);
      } else {
        spaces = await storage.getSpaces(10);
      }

      res.json(spaces);
    } catch (error) {
      console.error("Get spaces error:", error);
      res.status(500).json({ message: "Failed to get spaces" });
    }
  });

  // Categories route
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = [
        {
          id: 'finance',
          name: 'Finance',
          description: 'Get insights on markets, investments, and financial planning',
          icon: 'DollarSign',
          color: 'green',
          href: '/finance'
        },
        {
          id: 'travel',
          name: 'Travel',
          description: 'Discover destinations, plan trips, and travel tips',
          icon: 'Plane',
          color: 'blue',
          href: '/travel'
        },
        {
          id: 'shopping',
          name: 'Shopping',
          description: 'Find products, compare prices, and shopping advice',
          icon: 'ShoppingBag',
          color: 'purple',
          href: '/shopping'
        },
        {
          id: 'academic',
          name: 'Academic',
          description: 'Research assistance and educational content',
          icon: 'GraduationCap',
          color: 'orange',
          href: '/academic'
        }
      ];
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  // Chat Threads API (using conversations)
  app.post('/api/chat/threads', async (req, res) => {
    try {
      const { message, threadId } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      console.log(`Processing chat message: "${message.substring(0, 100)}..."`);

      // Generate AI response
      const aiResponse = await generateAIResponse(message);
      
      if (!aiResponse.content) {
        aiResponse.content = `I apologize, but I wasn't able to generate a response for "${message}". Please try again.`;
      }

      let conversation;
      let conversationId = threadId;

      if (threadId) {
        // Get existing conversation
        conversation = await storage.getConversation(threadId);
        if (!conversation) {
          return res.status(404).json({ message: "Thread not found" });
        }
      } else {
        // Create new conversation
        const title = message.length > 50 ? message.substring(0, 47) + "..." : message;
        conversation = await storage.createConversation({
          title,
          userId: null
        });
        conversationId = conversation._id ? conversation._id.toString() : conversation.id;
      }

      // Add user message
      await storage.createMessage({
        conversationId,
        role: 'user',
        content: message
      });

      // Add AI response
      await storage.createMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse.content,
        sources: aiResponse.sources || []
      });

      // Update conversation timestamp
      await storage.updateConversation(conversationId, { updatedAt: new Date() });

      // Get all messages for the conversation
      const messages = await storage.getMessagesByConversation(conversationId);

      res.json({
        threadId: conversationId,
        response: aiResponse.content,
        sources: aiResponse.sources || [],
        thread: {
          id: conversationId,
          title: conversation.title,
          messages: messages.map(msg => ({
            type: msg.role === 'user' ? 'user' : 'ai',
            content: msg.content,
            timestamp: msg.createdAt,
            sources: msg.sources || []
          })),
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        }
      });

    } catch (error) {
      console.error("Chat thread error:", error);
      res.status(500).json({ message: "Chat failed" });
    }
  });

  // Get recent chat threads (using conversations)
  app.get('/api/chat/threads', async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const conversations = await storage.getRecentConversations(parseInt(limit));
      
      // Transform to match expected format
      const threads = conversations.map(conv => ({
        id: conv._id,
        title: conv.title || 'Untitled',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage: conv.summary || '',
        messageCount: 0
      }));
      
      res.json(threads);
    } catch (error) {
      console.error("Get chat threads error:", error);
      res.json([]);
    }
  });

  // Get specific thread (using conversations)
  app.get('/api/chat/threads/:id', async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      const messages = await storage.getMessagesByConversation(req.params.id);
      
      const thread = {
        id: conversation._id,
        title: conversation.title,
        messages: messages.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'ai',
          content: msg.content,
          timestamp: msg.createdAt,
          sources: msg.sources || []
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      };
      
      res.json(thread);
    } catch (error) {
      console.error("Get thread error:", error);
      res.status(500).json({ message: "Failed to get thread" });
    }
  });

  // Delete thread (using conversations)
  app.delete('/api/chat/threads/:id', async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Thread not found" });
      }
      
      // Delete all messages first
      await storage.deleteMessagesByConversation(req.params.id);
      // Delete conversation
      await storage.deleteConversation(req.params.id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete thread error:", error);
      res.status(500).json({ message: "Failed to delete thread" });
    }
  });

  // Search threads (using conversations)
  app.get('/api/chat/search', async (req, res) => {
    try {
      const { q, limit = 10 } = req.query;
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }
      
      // Search conversations by title
      const conversations = await storage.searchConversations(q, parseInt(limit));
      
      // Transform to match expected format
      const threads = conversations.map(conv => ({
        id: conv._id,
        title: conv.title || 'Untitled',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage: conv.summary || '',
        messageCount: 0
      }));
      
      res.json(threads);
    } catch (error) {
      console.error("Search threads error:", error);
      res.json([]);
    }
  });

  // Legacy chat endpoint for backward compatibility
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, conversationId } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      let convId = conversationId;

      // Generate AI response
      const aiResponse = await generateAIResponse(message);
      
      if (!aiResponse.content) {
        aiResponse.content = `I apologize, but I wasn't able to generate a response for "${message}". Please try again.`;
      }

      // Save messages if we have a conversation
      if (convId) {
        // Save user message
        await storage.createMessage({
          conversationId: convId,
          role: "user",
          content: message,
        });

        // Save AI response
        await storage.createMessage({
          conversationId: convId,
          role: "assistant", 
          content: aiResponse.content,
          sources: aiResponse.sources,
        });

        // Update conversation timestamp
        await storage.updateConversation(convId, { updatedAt: new Date() });
      }

      res.json({
        conversationId: convId,
        response: aiResponse.content,
        sources: aiResponse.sources || [],
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Chat failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
