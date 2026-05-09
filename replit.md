# Replit.md - Pet Care Platform

## Overview

This is a comprehensive pet care platform built with a modern full-stack architecture. The application provides AI-powered personalized recommendations for pet care, including nutrition, grooming, and health advice, along with an e-commerce component for pet products and training resources.

## System Architecture

The application follows a monorepo structure with clearly separated frontend and backend concerns:

- **Frontend**: React TypeScript SPA with Vite build system
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **AI Integration**: OpenAI GPT-4o for personalized recommendations and chat

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter for client-side routing
- **State Management**: 
  - TanStack Query for server state
  - Zustand for cart management
  - React Hook Form for form state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom color variables

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database Access**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with proper error handling
- **External Services**: OpenAI API for AI-powered features

### Data Layer
The application uses a well-structured PostgreSQL schema with the following main entities:

1. **Pet Profiles**: Core pet information (name, age, breed, size)
2. **Products**: E-commerce catalog with categorization and ratings
3. **Care Recommendations**: AI-generated personalized care advice
4. **Training Programs**: Structured training content
5. **Chat Messages**: Conversational AI chat history

### Authentication & Authorization
Currently uses session-based approach with express sessions, though no authentication implementation is visible in the current codebase.

## Data Flow

1. **Pet Profile Creation**: Users create pet profiles which trigger AI recommendation generation
2. **AI Recommendations**: OpenAI generates personalized care advice based on pet characteristics
3. **Product Catalog**: Users browse and add products to cart with persistent storage
4. **AI Chat**: Real-time conversation with AI assistant for pet care questions
5. **Training Content**: Static training programs filtered by pet characteristics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **openai**: AI-powered recommendations and chat
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **zustand**: Client-side state management

### UI Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Development**: Single command (`npm run dev`) starts both frontend and backend
- **Production**: Optimized builds with proper static asset serving
- **Environment**: Node.js 20 with PostgreSQL 16 modules
- **Port Configuration**: Backend on port 5000, frontend served as static assets

### Database Management
- **Migration**: Drizzle Kit for schema migrations
- **Connection**: Environment variable `DATABASE_URL` for database connection
- **Push Command**: `npm run db:push` for direct schema synchronization

## Changelog
- June 23, 2025: Initial setup with complete AniCare platform
- June 23, 2025: Fixed UI issues - cart functionality, button styling, currency to INR
- June 23, 2025: Migrated from in-memory storage to PostgreSQL database with persistent data

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred currency: Indian Rupees (₹)
UI preferences: All buttons should work properly, consistent styling without fading effects