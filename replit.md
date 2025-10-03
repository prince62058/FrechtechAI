# Overview

**PrinceTech AI** is a modern AI-powered search and discovery platform built with React, TypeScript, and Express. The application provides an intelligent search experience with features like trending topics, categorized content, user spaces, and personalized search history. It's designed as a Perplexity-like interface where users can ask questions and receive AI-generated responses with cited sources.

**Recent Updates:**
- Added JWT-based authentication system with signup/login functionality
- Made codebase compatible with both Replit and VS Code environments
- Implemented secure password hashing with bcrypt
- Created dedicated authentication pages with modern UI
- Updated MongoDB schema to support user authentication

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and data fetching
- **UI Components**: Radix UI primitives with custom styling through shadcn/ui
- **Theme System**: Custom theme provider with dark/light mode support using CSS variables

## Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Middleware**: Custom logging, error handling, and authentication middleware
- **File Structure**: Modular approach with separate route handlers and business logic

## Authentication System
- **Authentication Method**: JWT (JSON Web Tokens) for stateless authentication
- **Password Security**: Bcrypt for password hashing with salt rounds
- **Token Management**: Tokens stored in localStorage, sent via Authorization header
- **User Management**: Email/password-based signup and login with validation
- **Security Features**: 
  - Password minimum length requirements
  - Email validation
  - Secure token generation and verification
  - Protected API endpoints with auth middleware
  - Automatic token cleanup on unauthorized requests

## Database & Data Storage
- **Primary Database**: MongoDB with Mongoose ODM
- **Schema Management**: Mongoose schemas with validation
- **Connection**: MongoDB Atlas or local MongoDB instance
- **Storage Interface**: Abstracted storage layer for database operations
- **Data Models**: Users (with authentication), searches, search history, trending topics, spaces, conversations, and messages
- **Environment Variable**: MONGODB_URI for database connection string

## AI Integration
- **Provider**: Google Gemini AI for generating search responses
- **Features**: Query processing, source citation, search suggestions
- **Response Format**: Structured JSON with content and sources
- **Error Handling**: Graceful fallbacks and retry logic
- **Environment Variable**: GEMINI_API_KEY for API authentication

## External Dependencies

- **Database**: MongoDB (Mongoose ODM) - compatible with MongoDB Atlas for production
- **AI Service**: Google Gemini API for AI-powered responses
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Hosting**: Designed for Replit with Render deployment support
- **Build Tools**: Vite with React plugin and TypeScript support
- **UI Components**: Radix UI primitives and Lucide React icons

## Deployment

The application is configured for deployment on Render:

### Render Deployment (Production)
- **Configuration File**: `render.yaml` for automatic blueprint deployment
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Required Environment Variables**:
  - `NODE_ENV=production`
  - `MONGODB_URI` (MongoDB Atlas connection string)
  - `GEMINI_API_KEY` (Google Gemini API key)
  - `PORT` (auto-assigned by Render, default 10000)

### Local Development
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build`
- **Production Start**: `npm start`
- **Port**: 5000 (configurable via PORT env var)
- **Database**: Local MongoDB or MongoDB Atlas

See `RENDER_DEPLOYMENT.md` for detailed deployment instructions.