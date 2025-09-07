# Health & Wellness Application

## Overview
A comprehensive health and wellness application with a React frontend and NestJS backend, featuring cutting-edge health tracking capabilities and AI-powered insights.

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: NestJS with Express integration
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Comprehensive Vitest testing suite
- **Authentication**: Passport.js with Google OAuth support
- **Payment**: Stripe integration for subscription model
- **Internationalization**: i18next support for Portuguese and English

## Key Features
- Dashboard with customizable widgets
- Activity tracking with detailed analytics
- Nutrition and hydration monitoring
- Sleep quality analysis
- Mental health tracking with meditation features
- Medication management
- Women's health cycle tracking
- Baby growth and development tracking
- Medical exam analysis with AI insights
- Video subscription club
- Personalized health plan generator
- Mobile-responsive design

## Recent Changes
- **January 2025**: Consolidated folder structure migration to frontend/ and backend/ directories
- **January 2025**: Added baby growth and development tracking functionality
- **January 2025**: Implemented comprehensive internationalization support
- **January 2025**: Added mobile navigation with baby tracking access

## Baby Tracking Features
- Baby profile management
- Growth measurements (weight, height)
- Milestone tracking
- Feeding schedule monitoring
- Sleep pattern analysis
- Vaccination records
- Development notes
- Multi-language support (PT/EN)

## User Preferences
- Language: Portuguese (primary), English (secondary)
- Design: Clean, modern, mobile-first approach
- Architecture: Clean Architecture principles
- Code style: TypeScript with strict typing
- Testing: Comprehensive test coverage required

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, Express, TypeScript
- **Database**: PostgreSQL, Drizzle ORM
- **Authentication**: Passport.js, Google OAuth
- **Payment**: Stripe
- **File Upload**: Multer
- **AI**: OpenAI integration
- **Testing**: Vitest, Playwright
- **Deployment**: Replit

## Project Structure
```
/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── locales/
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── application/
├── shared/            # Shared schemas and types
└── server/           # Express server configuration
```

## Database Schema Highlights
- User authentication and profiles
- Activity tracking with detailed metrics
- Health measurements and medical exams
- Baby profiles and growth tracking
- Subscription and payment records
- Multi-language content support

## Development Guidelines
- Follow Clean Architecture principles
- Use TypeScript for type safety
- Implement comprehensive error handling
- Maintain responsive design patterns
- Support internationalization
- Follow accessibility best practices
- Write comprehensive tests

## Notes
- Application supports both Portuguese and English languages
- Mobile-first responsive design approach
- Clean Architecture implementation with clear separation of concerns
- Comprehensive health tracking across all major wellness categories