# Rent & Flatmate Finder

A production-quality, full-stack SaaS platform connecting tenants with room owners using AI-powered compatibility scoring, real-time chat, and comprehensive role-based dashboards.

## Architecture
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, ShadCN UI, Zustand, TanStack Query
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, Socket.IO
- **AI Engine**: LLM Integration (OpenAI/Gemini/Claude) with rule-based fallback
- **Authentication**: JWT, Role-Based Authorization

## Features
- AI Compatibility Matchmaking
- Real-Time Chat (Socket.IO)
- Role-based Dashboards (Tenant, Owner, Admin)
- Email Notifications
- Advanced Search & Filtering
- Soft Deletes & Pagination

## Folder Structure
- `/client` - Next.js frontend application
- `/server` - Express.js backend application

## Quick Start
Detailed instructions in the respective folders.

1. Copy `.env.example` to `.env` in both `client` and `server` folders
2. Run `docker-compose up -d` to start PostgreSQL and Redis
3. In `server`, run `npm run db:migrate` then `npm run dev`
4. In `client`, run `npm run dev`
