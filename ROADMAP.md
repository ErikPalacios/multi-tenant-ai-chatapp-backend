# Heronova 1.0.0 - SaaS Development Roadmap 🚀

This roadmap outlines the path to transforming Heronova from a functional backend into a production-ready, revenue-generating SaaS product based on a "White-Glove" (Llave en mano) onboarding model.

## Phase 1: The First Impression & Onboarding
*Target: Create a seamless and professional experience for new business owners immediately after they register.*

- [ ] **Onboarding Questionnaire UI**:
  - Build a welcome screen that appears right after registration/first login.
  - Ask 3-4 key questions to profile the client:
    1. Industry type (Clinic, Salon, Restaurant, etc.).
    2. Approximate monthly message volume.
    3. Current WhatsApp usage (None, WhatsApp Business, API).
  - Save this data to the `Business` document in Firestore to help you decide the best technical architecture (Meta Cloud API vs WATI vs Other) for each client.
- [ ] **Pending Setup State**:
  - Since WhatsApp setup is manual initially, show a "Pending Setup" status card on the dashboard instructing the user to schedule a configuration call or wait for your team.

## Phase 2: The Owner's Dashboard (Core Value)
*Target: Give the business owner a visual interface where they feel in control of the AI and their data.*

- [ ] **Conversations View (Inbox)**:
  - Create a chat interface in the frontend where owners can read what the AI is talking about with their customers in real-time.
  - **Human Handoff**: Add a toggle button to "Pause AI" for a specific conversation so the owner can jump in and reply manually.
- [ ] **AI Persona & Rules Configuration**:
  - A settings page where the owner can easily edit the "System Prompt" (e.g., business hours, tone of voice, specific rules to follow).
- [ ] **Calendar & Appointments Module**:
  - Visual calendar (FullCalendar or similar) inside the dashboard showing all appointments booked by the AI.
  - Email or push notifications (via frontend) alerting the owner of new bookings.

## Phase 3: Team Management & Operations
*Target: Allow businesses to operate at scale without mixing roles.*

- [ ] **Employee Management Page (`/dashboard/employees`)**:
  - A table listing all current employees.
  - An "Add Employee" modal (Emails & Password generation) calling the existing protected `POST /employees` route.
- [ ] **Role-Based Access Control (RBAC) in Frontend**:
  - Ensure Employees logging in only see the Calendar and Inbox, but cannot edit AI rules, billing, or add other employees.

## Phase 3.5: The Employee Experience 👩‍💼
*Target: Create a tailored, distraction-free environment for staff to manage their daily work, boosting adoption rate.*

- [ ] **Individual Workspaces (Calendars)**:
  - When an 'EMPLOYEE' logs in, filter the calendar to show *only* the appointments assigned to them, unlike the owner who sees everything.
- [ ] **Live Inbox & Human Handoff Control**:
  - A clean "Live Chat" view for the employee to monitor active conversations.
  - A definitive "Take Control" button to pause the AI and reply manually when a human touch is needed.
- [ ] **Performance & Commissions Gamification**:
  - A dashboard widget displaying today's booked appointments and calculated earned commissions from the AI's work.
- [ ] **Toggle Availability (Busy/Available)**:
  - A quick status switch so the employee can mark themselves "Away/On Lunch". The AI will instantly stop offering their time slots until they return.

## Phase 4: Monetization & Resiliency (The Business Engine)
*Target: Automate revenue collection and ensure the bot never crashes silently.*

- [ ] **Stripe Integration (Billing)**:
  - Integrate Stripe Subscriptions.
  - If a payment fails, automatically flag the `Business` document as inactive and pause the webhook/AI processing.
- [ ] **AI Graceful Degradation**:
  - Implement fallback responses. If the LLM provider (OpenAI, Anthropic, etc.) times out or throws an error, the bot should reply something like: *"Dame un momento, estoy revisando el sistema..."* instead of crashing.

---
*Future Vision (Phase 5): Become a WhatsApp BSP, implement Embedded Signup for automatic WhatsApp Number connection without your manual intervention.*
