# Frontend Implementation Plan
**Team:** devinjosh  
**Start Date:** TBD  
**Status:** Planning Phase (API Controller Pending)

## Overview
This document outlines the implementation plan for the React frontend feedback portal. Since the API controller is still in development, we will use mock/stub implementations initially and transition to real API calls once the backend is ready.

---

## Project Structure
```bash
src/
├── components/
│ ├── SubmitFeedback/
│ │ ├── SubmitFeedback.tsx # Main form component
│ │ ├── SubmitFeedback.css # Component styles
│ │ └── useSubmitFeedback.ts # Custom hook for form logic
│ ├── MyFeedback/
│ │ ├── MyFeedback.tsx # Main list component
│ │ ├── FeedbackList.tsx # Feedback list display
│ │ ├── FeedbackCard.tsx # Individual feedback item
│ │ ├── MyFeedback.css # Component styles
│ │ └── useMyFeedback.ts # Custom hook for data fetching
│ └── shared/
│ ├── Button.tsx # Reusable button component
│ ├── Input.tsx # Reusable input component
│ ├── RatingSelector.tsx # Star rating selector (1-5)
│ ├── ErrorMessage.tsx # Error display component
│ ├── SuccessMessage.tsx # Success message component
│ └── LoadingSpinner.tsx # Loading indicator
├── services/
│ ├── api.ts # Base API client configuration
│ ├── feedbackService.ts # Feedback API service layer
│ └── mockFeedbackService.ts # Mock service (temp, for dev)
├── types/
│ └── feedback.ts # TypeScript interfaces/types
├── utils/
│ ├── validation.ts # Client-side validation helpers
│ └── dateUtils.ts # Date formatting utilities
├── App.tsx # Main app component (routing/layout)
├── App.css # Global app styles
└── main.tsx # Entry point
```
## Features to Implement

---

### 1. Submit Feedback Form
**Component:** `SubmitFeedback`  
**Developer:** [TBD - Feature Split Option 1]  
**Priority:** High

**Form Fields:**
- **memberId** (text input)
  - Required field
  - Label: "Member ID"
  - Placeholder: "Enter your member ID"
  - Max length: 36 characters
  - Real-time validation feedback
  - Error message: "Member ID is required" / "Member ID must be less than 36 characters"
  
- **providerName** (text input)
  - Required field
  - Label: "Provider Name"
  - Placeholder: "Enter provider name (e.g., Dr. Smith)"
  - Max length: 80 characters
  - Real-time validation feedback
  - Error message: "Provider name is required" / "Provider name must be less than 80 characters"
  
- **rating** (1-5 selector)
  - Required field
  - Visual star rating component (5 stars)
  - Click to select rating (1-5)
  - Hover states for better UX
  - Clear indication of selected rating
  - Error message: "Rating is required" / "Rating must be between 1 and 5"
  
- **comment** (textarea)
  - Optional field
  - Label: "Comment (Optional)"
  - Placeholder: "Share your experience..."
  - Max length: 200 characters
  - Character counter display (e.g., "150/200 characters")
  - Auto-resize or fixed height with scroll
  - Error message: "Comment must be less than 200 characters"

**Validation Requirements:**
- **Real-time validation:** Validate on blur for each field
- **Submit-time validation:** Validate all fields before API call
- **Client-side rules** (mirror server exactly):
  - memberId: required, non-empty (trim whitespace), max 36 chars
  - providerName: required, non-empty (trim whitespace), max 80 chars
  - rating: required, integer between 1-5
  - comment: optional, max 200 chars if provided
- **Inline error display:** Show errors below each field
- **Disable submit:** If validation fails or during submission

**User Experience:**
- Submit button (disabled during submission)
- Loading spinner/state during API call
- Success message on successful submission (e.g., "Feedback submitted successfully!")
- Success state: Clear form and show confirmation
- Error display:
  - Field-level errors (shown inline)
  - General errors (API errors, network failures)
  - Display API error response format: `{ errors: [{ field, message }] }`
- Form reset after successful submission
- Accessibility: Proper labels, ARIA attributes, keyboard navigation

**API Integration:**
- `POST /api/v1/feedback`
- Request body: `FeedbackRequest` type
- Handle 201 Created response → Show success
- Handle 400 Bad Request → Display validation errors
- Handle 500/network errors → Show general error message
- Mock implementation until API is ready

---

### 2. My Feedback List
**Component:** `MyFeedback`  
**Developer:** [TBD - Feature Split Option 1]  
**Priority:** High

**Search/Filter Section:**
- **MemberId input field**
  - Label: "Member ID"
  - Placeholder: "Enter member ID to view feedback"
  - Text input with optional validation
  - "Load Feedback" button
  - "Clear" button (resets input and list)
  - Disable buttons during loading
  - Validation: Non-empty before allowing search

**Feedback List Display:**
- **Container:** Scrollable list area
- **FeedbackCard Component** (individual items):
  - **Provider Name:** Prominently displayed (header style)
  - **Rating:** Visual star display (e.g., ★★★★☆ for 4/5)
    - Alternative: Numeric with visual indicator
  - **Comment:** Display if present
    - Style: Italic or secondary text color if no comment
    - Show "No comment provided" or similar for null comments
  - **Submitted Date:** 
    - Format: Human-readable (e.g., "Nov 10, 2025 at 3:45 PM")
    - Or relative time (e.g., "2 days ago")
    - Show full timestamp on hover
  - **Card Styling:** 
    - Border/shadow for separation
    - Hover effects
    - Responsive layout

**List States:**
- **Empty State:**
  - Show when no feedback found (after successful search with empty results)
  - Message: "No feedback found for this member ID"
  - Visual indicator (icon or illustration)
  
- **Initial State:**
  - Show before any search is performed
  - Message: "Enter a member ID to view feedback"
  - Optional: Instructions or example member ID
  
- **Loading State:**
  - Loading spinner/indicator
  - Message: "Loading feedback..."
  - Disable input and buttons during fetch
  
- **Error State:**
  - Display API error messages
  - Handle 404, 500, network errors
  - Show retry button
  - Message: "Failed to load feedback. Please try again."

**Additional Features:**
- **Sorting** (optional enhancement):
  - By date (newest first / oldest first)
  - By rating (highest / lowest)
- **Empty list message:** "No feedback available for this member"
- **Clear/reset functionality:** Clear input and list
- **Refresh capability:** Re-fetch current member's feedback

**API Integration:**
- `GET /api/v1/feedback?memberId=<id>`
- Handle 200 OK → Display list (empty array shows empty state)
- Handle 500/network errors → Show error state
- Handle invalid memberId format → Client-side validation
- Mock implementation until API is ready

---

### 3. Application Layout & Navigation
**Component:** `App`  
**Developer:** [Shared - Both]  
**Priority:** High

**Layout Structure:**
- **Header/Navigation:**
  - Application title: "Provider Feedback Portal"
  - Navigation tabs or buttons:
    - "Submit Feedback" (navigate to form)
    - "My Feedback" (navigate to list)
  - Simple, clean design
  
- **Main Content Area:**
  - Container for active component
  - Centered layout with max-width
  - Responsive padding/margins
  
- **Footer** (optional):
  - Simple footer with project info
  - Or minimal/no footer

**Navigation Approach:**
- **Option A:** Simple state-based (conditional rendering)
  - Use React state to switch between components
  - No routing library needed
  - Suitable for 2-page app
  
- **Option B:** React Router (if multi-page feels more appropriate)
  - Routes: `/` (home), `/submit` (form), `/feedback` (list)
  - More scalable if adding more pages later

**Styling:**
- Consistent color scheme
- Responsive design (mobile-friendly)
- Clean, professional appearance

---

### 4. Shared/Common Components
**Location:** `src/components/shared/`  
**Developer:** [Shared - Both]  
**Priority:** High

**Components to Build:**

1. **Button.tsx**
   - Variants: `primary`, `secondary`, `danger`
   - Sizes: `small`, `medium`, `large`
   - Props: `disabled`, `loading`, `onClick`, `type`
   - Loading state with spinner
   - Disabled state styling
   - Accessibility: proper ARIA attributes

2. **Input.tsx**
   - Text input wrapper
   - Props: `label`, `error`, `required`, `maxLength`, `placeholder`, `value`, `onChange`
   - Shows label
   - Displays error message below
   - Required field indicator (*)
   - Character counter (if maxLength provided)
   - Focus states
   - Accessibility: label association, error announcement

3. **Textarea.tsx**
   - Textarea wrapper
   - Similar props to Input
   - Character counter display
   - Auto-resize or fixed height
   - Same validation/error display pattern

4. **RatingSelector.tsx**
   - Visual star rating (1-5)
   - Interactive: click to select
   - Hover effects
   - Displays selected rating
   - Props: `value`, `onChange`, `disabled`, `error`
   - Accessible: keyboard navigation, ARIA labels

5. **ErrorMessage.tsx**
   - Consistent error display
   - Props: `message`, `field` (optional)
   - Styling: red/error color
   - Can display field-level or general errors

6. **SuccessMessage.tsx**
   - Success notification
   - Props: `message`
   - Styling: green/success color
   - Auto-dismiss option (optional)

7. **LoadingSpinner.tsx**
   - Loading indicator
   - Size variants
   - Can be standalone or inline
   - Accessibility: ARIA live region

8. **FeedbackCard.tsx**
   - Individual feedback item display
   - Props: `feedback` (FeedbackResponse)
   - Displays: provider name, rating, comment, date
   - Consistent styling with hover effects

---

### 5. API Integration Layer
**Location:** `src/services/`  
**Developer:** [Shared - Both]  
**Priority:** High

**Services to Build:**

1. **api.ts** (Base API Client)
   - Configure base URL from environment
   - Set default headers (Content-Type: application/json)
   - Request/response interceptors
   - Error handling wrapper
   - TypeScript types for responses

2. **feedbackService.ts** (Real API Service)
   - `submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse>`
   - `getFeedbackById(id: string): Promise<FeedbackResponse>`
   - `getFeedbackByMemberId(memberId: string): Promise<FeedbackResponse[]>`
   - Error handling and type conversion
   - Uses base API client

3. **mockFeedbackService.ts** (Mock Service)
   - Implements same interface as real service
   - Simulates network delays (200-500ms)
   - Returns mock data
   - Can simulate errors for testing
   - In-memory storage for list functionality

4. **Service Factory** (Environment-based switching)
   - Check `VITE_USE_MOCK_API` env variable
   - Export appropriate service (mock or real)
   - Seamless switching between mock/real

---

### 6. TypeScript Types & Interfaces
**Location:** `src/types/feedback.ts`  
**Developer:** [Shared - Both]  
**Priority:** High

**Types to Define:**

```typescript
// Request/Response types matching API exactly
interface FeedbackRequest {
  memberId: string;
  providerName: string;
  rating: number;
  comment?: string;
}

interface FeedbackResponse {
  id: string;
  memberId: string;
  providerName: string;
  rating: number;
  comment: string | null;
  submittedAt: string; // ISO 8601
}

interface FieldError {
  field: string;
  message: string;
}

interface ErrorResponse {
  errors: FieldError[];
}

// Component prop types
interface SubmitFeedbackProps {
  // Component-specific props
}

interface MyFeedbackProps {
  // Component-specific props
}
```

---

### 7. Utility Functions
**Location:** `src/utils/`  
**Developer:** [Shared - Both]  
**Priority:** Medium

**Utilities:**

1. **validation.ts**
   - `validateMemberId(value: string): string | null` (returns error message or null)
   - `validateProviderName(value: string): string | null`
   - `validateRating(value: number): string | null`
   - `validateComment(value: string): string | null`
   - `validateFeedbackRequest(request: FeedbackRequest): FieldError[]` (full validation)

2. **dateUtils.ts**
   - `formatDate(isoString: string): string` (human-readable format)
   - `formatDateRelative(isoString: string): string` (relative time)
   - `formatDateFull(isoString: string): string` (full timestamp)

3. **apiUtils.ts** (optional)
   - Error parsing utilities
   - Response transformation helpers

---

### 8. Environment Configuration
**Location:** `.env` files  
**Developer:** [Shared - Both]  
**Priority:** High

**Environment Variables:**

`.env` (local development):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
```

`.env.production` (production):
```env
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCK_API=false
```

**Configuration:**
- Vite environment variable access: `import.meta.env.VITE_*`
- Type safety for env variables (optional)

---

### 9. Error Handling & User Feedback
**Developer:** [Shared - Both]  
**Priority:** High

**Error Scenarios:**

1. **Network Errors:**
   - Display user-friendly message: "Unable to connect. Please check your connection and try again."
   - Show retry option

2. **API Validation Errors (400):**
   - Parse `ErrorResponse` format
   - Display field-level errors inline
   - Highlight fields with errors

3. **Server Errors (500):**
   - Display: "Something went wrong. Please try again later."
   - Log error details (development mode)

4. **Not Found (404):**
   - For GET /feedback/{id}: "Feedback not found"
   - For list: Show empty state

5. **Timeout Errors:**
   - Show: "Request timed out. Please try again."

**User Feedback:**
- Clear success messages (disappear after 3-5 seconds or on user action)
- Error messages remain visible until dismissed or fixed
- Loading states clearly indicate background activity
- Form validation feedback is immediate and clear

---

### 10. Styling & Theming
**Developer:** [Shared - Both]  
**Priority:** Medium

**Approach Options:**
- **CSS Modules:** Scoped component styles
- **Styled Components:** CSS-in-JS (requires dependency)
- **Tailwind CSS:** Utility-first (requires dependency)
- **Plain CSS:** Simple, no dependencies

**Design Requirements:**
- **Color Scheme:** Professional, accessible
- **Typography:** Clear, readable fonts
- **Spacing:** Consistent margins/padding
- **Responsive:** Mobile-first design
  - Breakpoints: Mobile (< 768px), Tablet (768px - 1024px), Desktop (> 1024px)
- **Accessibility:**
  - Sufficient color contrast (WCAG AA)
  - Focus indicators
  - Screen reader friendly

**Global Styles:**
- Reset/normalize CSS
- Base typography
- Color variables
- Spacing system

---

### 11. Responsive Design
**Developer:** [Shared - Both]  
**Priority:** Medium

**Breakpoints:**
- **Mobile (< 768px):**
  - Single column layout
  - Stack form fields vertically
  - Touch-friendly button sizes (min 44x44px)
  - Full-width inputs
  
- **Tablet (768px - 1024px):**
  - Optimized spacing
  - Two-column layout where appropriate
  
- **Desktop (> 1024px):**
  - Centered content with max-width
  - Comfortable spacing
  - Hover states

**Responsive Features:**
- Form layout adapts to screen size
- List items stack on mobile, grid on desktop (optional)
- Navigation adapts (hamburger menu on mobile, if needed)
- Touch targets appropriately sized

---

### 12. Accessibility (A11y)
**Developer:** [Shared - Both]  
**Priority:** Medium

**Requirements:**
- **Semantic HTML:** Use proper HTML elements (form, input, button, etc.)
- **ARIA Labels:** Proper labels for screen readers
- **Keyboard Navigation:**
  - All interactive elements keyboard accessible
  - Tab order is logical
  - Focus indicators visible
- **Form Labels:**
  - All inputs have associated labels
  - Required fields indicated
  - Error messages associated with fields
- **Color Contrast:** WCAG AA minimum
- **Screen Reader Support:**
  - Error announcements
  - Success message announcements
  - Loading state announcements

---

### 13. Testing Strategy (Optional)
**Developer:** [If time permits]  
**Priority:** Low (Optional)

**Recommended Tests:**

1. **Unit Tests:**
   - Validation utilities
   - Date formatting utilities
   - Utility functions

2. **Component Tests:**
   - SubmitFeedback form validation
   - MyFeedback list rendering
   - Error state displays
   - Loading state displays

3. **Integration Tests:**
   - Full form submission flow
   - Feedback list fetch flow
   - Error handling scenarios

**Testing Tools:**
- Vitest (Vite's built-in test runner)
- React Testing Library
- Jest (if preferred)

---

## Feature Completion Checklist

### Phase 1: Foundation
- [ ] Set up environment variables (.env)
- [ ] Create TypeScript types/interfaces
- [ ] Set up API client structure
- [ ] Create mock service
- [ ] Create utility functions (validation, date)

### Phase 2: Shared Components
- [ ] Button component
- [ ] Input component
- [ ] Textarea component
- [ ] RatingSelector component
- [ ] ErrorMessage component
- [ ] SuccessMessage component
- [ ] LoadingSpinner component
- [ ] FeedbackCard component

### Phase 3: Submit Feedback
- [ ] SubmitFeedback component
- [ ] useSubmitFeedback hook
- [ ] Form validation logic
- [ ] API integration (mock → real)
- [ ] Success/error handling
- [ ] Component styling

### Phase 4: My Feedback List
- [ ] MyFeedback component
- [ ] FeedbackList component
- [ ] useMyFeedback hook
- [ ] Data fetching logic
- [ ] Loading/empty/error states
- [ ] Component styling

### Phase 5: Application Integration
- [ ] App.tsx layout
- [ ] Navigation/routing
- [ ] Global styling
- [ ] Replace mock with real API
- [ ] End-to-end testing

### Phase 6: Polish
- [ ] Responsive design refinement
- [ ] Accessibility improvements
- [ ] Error handling enhancements
- [ ] Loading state improvements
- [ ] Code cleanup and documentation

---

## Technology Decisions Needed

- [ ] **Styling:** CSS Modules / Styled Components / Tailwind / Plain CSS?
- [ ] **HTTP Client:** Fetch API / Axios?
- [ ] **Form Library:** React Hook Form / Native React?
- [ ] **Routing:** React Router / State-based conditional rendering?
- [ ] **Date Formatting:** date-fns / native / custom?
- [ ] **Testing:** Vitest / Jest / Manual testing only?

---

## Dependencies to Consider

```json
{
  "dependencies": {
    "react-router-dom": "^6.x",           // If routing needed
    "axios": "^1.x",                      // If preferred over fetch
    "react-hook-form": "^7.x",            // For form management
    "date-fns": "^2.x"                    // For date formatting
  }
}
```
