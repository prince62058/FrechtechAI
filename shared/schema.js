import mongoose from 'mongoose';
import { z } from 'zod';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profileImageUrl: { type: String },
}, { timestamps: true });

const SearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  query: { type: String, required: true },
  response: { type: String },
  category: { type: String },
  sources: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const TrendingTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  readTime: { type: String },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

const SpaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  templateCount: { type: Number, default: 0 },
  icon: { type: String },
  gradient: { type: String },
  tags: { type: mongoose.Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  summary: { type: String },
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  sources: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const SearchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  searchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Search' },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Search = mongoose.model('Search', SearchSchema);
export const TrendingTopic = mongoose.model('TrendingTopic', TrendingTopicSchema);
export const Space = mongoose.model('Space', SpaceSchema);
export const Conversation = mongoose.model('Conversation', ConversationSchema);
export const Message = mongoose.model('Message', MessageSchema);
export const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);

// Zod schemas for validation
export const insertSearchSchema = z.object({
  userId: z.string().optional(),
  query: z.string(),
  response: z.string().optional(),
  category: z.string().optional(),
  sources: z.any().optional(),
});

export const insertTrendingTopicSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  readTime: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  viewCount: z.number().optional(),
});

export const insertSpaceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string(),
  templateCount: z.number().optional(),
  icon: z.string().optional(),
  gradient: z.string().optional(),
  tags: z.any().optional(),
  isActive: z.boolean().optional(),
});

export const insertConversationSchema = z.object({
  userId: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
});

export const insertMessageSchema = z.object({
  conversationId: z.string(),
  role: z.string(),
  content: z.string(),
  sources: z.any().optional(),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
