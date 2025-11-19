# Frontend Feedback UI

A modern React-based single-page application (SPA) for submitting and viewing provider feedback. 
Built with TypeScript, Vite, and Tailwind CSS, this frontend provides an intuitive user interface for the Provider Feedback Portal.

## Table of Contents

- [Overview](#overview)
- [Architecture & Role](#architecture--role)
- [Codebase Structure](#codebase-structure)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features & Components](#features--components)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)

---

## Overview

The Frontend Feedback UI is a client-side application that:

- **Provides** a user-friendly interface for submitting feedback
- **Displays** feedback submissions with search capabilities
- **Validates** user input both client-side and server-side
- **Handles** errors gracefully with clear user feedback
- **Integrates** with the Feedback API via REST endpoints
- **Supports** responsive design with dark mode

This application follows modern React patterns with functional components, hooks, and TypeScript for type safety. 
It uses React Router for navigation and Tailwind CSS for styling.

---

## Architecture & Role

### How It Fits in the System

```
┌─────────────────────┐
│  Frontend UI        │ ← You are here
│  (This Application) │
└──────────┬──────────┘
           │ HTTP REST
           ▼
┌─────────────────────┐
│   Feedback API       │
│  (Spring Boot)       │
└──────────┬───────────┘
           │
           ├──► PostgreSQL (persistence)
           │
           └──► Kafka Topic: feedback-submitted
                      │
                      ▼
             ┌─────────────────┐
             │ Analytics        │
             │ Consumer         │
             └─────────────────┘
```

### Data Flow

1. **User** interacts with React UI (submit feedback or view feedback)
2. **Frontend** validates input client-side
3. **Frontend** sends HTTP request to Feedback API (`http://localhost:8082/api/v1`)
4. **API** processes request, validates server-side, persists to database, publishes to Kafka
5. **Frontend** receives response and updates UI accordingly
6. **User** sees success message or error details

---

## Codebase Structure

```
tsg-9.27-devinjosh-frontend-feedback-ui/
├── src/
│   ├── components/
│   │   ├── SubmitFeedback/
│   │   │   ├── SubmitFeedback.tsx        # Feedback submission form
│   │   │   └── index.ts
│   │   ├── MyFeedback/
│   │   │   ├── MyFeedback.tsx            # Feedback search and display
│   │   │   ├── FeedbackCard.tsx         # Individual feedback card component
│   │   │   └── index.ts
│   │   └── shared/
│   │       ├── Navigation.tsx            # Top navigation bar
│   │       ├── ErrorDisplay.tsx          # Error message component
│   │       ├── LoadingSpinner.tsx        # Loading indicator
│   │       └── index.ts
│   ├── services/
│   │   ├── api.ts                        # HTTP client with error handling
│   │   └── feedbackService.ts            # Feedback API service layer
│   ├── types/
│   │   └── feedback.ts                   # TypeScript interfaces
│   ├── utils/
│   │   ├── validation.ts                 # Client-side validation functions
│   │   └── dateUtils.ts                  # Date formatting utilities
│   ├── App.tsx                           # Main app component with routing
│   ├── main.tsx                          # Application entry point
│   ├── App.css                           # Global styles
│   └── index.css                         # Tailwind CSS imports
├── public/
│   └── vite.svg                          # Static assets
├── Dockerfile                            # Production container image
├── nginx.conf                            # Nginx configuration for SPA
├── package.json                          # Dependencies and scripts
├── vite.config.ts                        # Vite build configuration
├── tailwind.config.js                    # Tailwind CSS configuration
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # This file
```

### Key Components

#### 1. `App.tsx`
- **Purpose**: Main application component with React Router setup
- **Routes**:
  - `/` → Redirects to `/submit`
  - `/submit` → SubmitFeedback component
  - `/my-feedback` → MyFeedback component
- **Features**: Navigation bar, dark mode support

#### 2. `SubmitFeedback.tsx`
- **Purpose**: Form for submitting new feedback
- **Fields**: memberId, providerName, rating (1-5 stars), comment (optional)
- **Features**:
  - Client-side validation
  - Real-time error display
  - Character counters
  - Star rating component (react-stars)
  - Loading states
  - Success navigation

#### 3. `MyFeedback.tsx`
- **Purpose**: Search and display feedback
- **Search Modes**:
  - By Member ID (returns array)
  - By Feedback ID (returns single item)
- **Features**:
  - Search form with mode toggle
  - Results display with FeedbackCard components
  - Loading and error states
  - Empty state handling

#### 4. `FeedbackCard.tsx`
- **Purpose**: Display individual feedback item
- **Features**: Formatted date, rating display, comment display

#### 5. `api.ts`
- **Purpose**: HTTP client wrapper
- **Features**:
  - Centralized API base URL configuration
  - Error handling (network errors, API errors)
  - Response parsing
  - Custom `ApiError` class

#### 6. `feedbackService.ts`
- **Purpose**: Service layer for Feedback API
- **Methods**:
  - `submitFeedback(request)` → POST `/feedback`
  - `getFeedbackById(id)` → GET `/feedback/{id}`
  - `getFeedbackByMemberId(memberId)` → GET `/feedback?memberId={id}`

#### 7. `validation.ts`
- **Purpose**: Client-side validation functions
- **Rules**:
  - `memberId`: Required, max 36 characters
  - `providerName`: Required, max 80 characters
  - `rating`: Required, integer 1-5
  - `comment`: Optional, max 200 characters

#### 8. `dateUtils.ts`
- **Purpose**: Date formatting utilities
- **Functions**:
  - `formatDate()`: Standard date format
  - `formatDateRelative()`: Relative time (e.g., "2 hours ago")
  - `formatDateFull()`: Full date with timezone

---

## Prerequisites

### Required Software

- **Node.js 20+** (LTS recommended)
  - Verify: `node --version`
  - Download: [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js)
  - Verify: `npm --version`

---

## Configuration

### Environment Variables

The application can be configured via environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8082/api/v1` | Base URL for Feedback API |

**Setting Environment Variables:**

Create a `.env` file in the project root:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8082/api/v1
```

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

### Configuration Files

#### `vite.config.ts`
- Vite build configuration
- React plugin setup
- Development server settings

#### `tailwind.config.js`
- Tailwind CSS theme customization
- Custom color palette (primary colors)
- Content paths for purging unused styles

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases
- Strict type checking enabled

#### `nginx.conf` (Production)
- Nginx server configuration
- SPA fallback routing (all routes → `index.html`)
- Static file serving

---

## Running the Application

### Local Development

**Prerequisites**: Feedback API must be running on port 8082

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output**:
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Access the Application**:
- Open http://localhost:5173 in your browser
- Hot module replacement (HMR) enabled for instant updates

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Build Output**: `dist/` directory contains optimized static files

### Running with Docker Compose (Full Stack)

From the `joshua-devin-final` directory:

```bash
# Start all services including frontend
docker compose --profile app up -d frontend-ui

# View logs
docker compose --profile app logs -f frontend-ui
```

**Access**: http://localhost:5173 (mapped from container port 80)

---

## Features & Components

### Submit Feedback Page (`/submit`)

- **Form Fields**:
  - Member ID (required, max 36 chars)
  - Provider Name (required, max 80 chars)
  - Rating (required, 1-5 stars using react-stars)
  - Comment (optional, max 200 chars with counter)
- **Validation**:
  - Real-time field validation
  - Client-side validation before submission
  - Server-side validation error display
- **User Experience**:
  - Loading state during submission
  - Success navigation to My Feedback page
  - Error messages with dismiss option
  - Disabled form during submission

### My Feedback Page (`/my-feedback`)

- **Search Functionality**:
  - Toggle between Member ID and Feedback ID search
  - Real-time search execution
  - Loading states
- **Results Display**:
  - Feedback cards with formatted dates
  - Star rating visualization
  - Comment display
  - Empty state when no results
- **Error Handling**:
  - Network error messages
  - Not found messages
  - User-friendly error display

### Navigation

- **Top Navigation Bar**:
  - Application title
  - Navigation buttons (Submit Feedback, My Feedback)
  - Dark mode support
  - Responsive design

---

## API Integration

### API Client (`api.ts`)

The API client provides a wrapper around the Fetch API with:

- **Automatic Error Handling**: Converts HTTP errors to `ApiError` instances
- **Network Error Detection**: Catches connection refused, timeout, etc.
- **Response Parsing**: Handles JSON responses and empty responses
- **Type Safety**: Generic methods for type-safe responses

### Feedback Service (`feedbackService.ts`)

Service layer that abstracts API calls:

```typescript
// Submit feedback
const response = await feedbackService.submitFeedback({
  memberId: 'm-123',
  providerName: 'Dr. Smith',
  rating: 4,
  comment: 'Great experience.'
});

// Get feedback by ID
const feedback = await feedbackService.getFeedbackById('uuid-here');

// Get feedback by member ID
const feedbackList = await feedbackService.getFeedbackByMemberId('m-123');
```

### Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check (via build)
npm run build
```

### Docker Commands

```bash
# Build Docker image
docker build -t frontend-ui .

# Run container
docker run -p 5173:80 frontend-ui

# View logs (from docker-compose)
docker compose --profile app logs -f frontend-ui

# Rebuild after code changes
docker compose --profile app build frontend-ui
docker compose --profile app up -d frontend-ui
```

---

## Additional Resources

### Related Documentation

- **Main Project README**: `../joshua-devin-final/README.md`
- **Feedback API**: `../tsg-9.27-devinjosh-feedback-api/README.md`
- **Analytics Consumer**: `../tsg-9.27-devinjosh-feedback-analytics-consumer/README.md`
- **Project Specification**: `../joshua-devin-final/documentation/Spec_Provider_Feedback_Portal.md`
- **Frontend Implementation Notes**: `docs/frontend-implementation.md`