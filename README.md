# OmniBiz CRM

OmniBiz is a full-stack sales workspace for lead generation, pipeline management, campaign tracking, and automated follow-up. It blends a modern React front end with a lightweight Express server, Firebase authentication, and simulated or live provider integrations for AI enrichment, scraping, and outbound outreach.

The system is designed to feel like a compact command center for a revenue team: find new prospects, qualify them, see them move across a sales pipeline, and keep follow-ups moving without bouncing between different tools.

## What this CRM does

At a high level, the application performs five jobs:

- Finds or imports new leads from Google Maps, social discovery, web crawling, and ad campaign webhook sources.
- Enriches each record with a score, notes, business context, and recommended next steps.
- Tracks every lead across a pipeline from new to closed won or closed lost.
- Launches automated email and AI voice outreach workflows.
- Persists user state, campaign settings, and profile data so the workspace feels like a live CRM rather than a static demo.

## System architecture

### Front end

The UI lives in the React app under src/.

- src/App.tsx acts as the main application orchestrator.
- It manages authentication state, current page view, lead and campaign data, profile settings, and the modal workflow.
- It keeps the app state in React useState, then persists it to local storage and Firebase-backed app state when available.

### Back end

The server runs from server.ts and serves the app while also exposing CRM and integration routes.

It handles:

- Authentication/session validation
- CRM state retrieval and persistence
- Campaign webhook ingestion
- Scraper endpoints for maps, social, and web data
- Outreach callback handling for email and call status updates
- Optional AI calls to Gemini for realistic lead generation and enrichment

### Data layer

The central business types are declared in src/types.ts.

Key domain objects:

- Lead: full prospect record, including contact info, pipeline stage, deal value, AI insights, and activity timeline.
- Campaign: paid media or inbound acquisition source with budget, spend, lead count, and revenue data.
- EmailCadence: multi-step email sequence template used for automated outreach.
- FollowUpTask: manual or automated task assigned to a lead.

### Authentication and persistence

- Firebase authentication is configured in src/firebase.ts.
- Session and profile logic is managed from src/services/apiService.ts.
- App state loads from Firebase if a user is authenticated; otherwise it falls back to localStorage.
- The Express server also supports a server-side auth session model for demo API access, although the UI relies primarily on Firebase.

### AI and integrations

The product is built to support real provider connectors, but it includes safe fallback simulation logic.

- Gemini is used for realistic dataset generation and AI enrichment prompts.
- Google Maps, social, and web scraping endpoints generate lead data when API keys or third-party services are not configured.
- Provider keys can be stored in the Profile page so the app can connect to real services when configured.

## App flow in practice

The typical lifecycle of a lead looks like this:

1. A lead is collected from a map search, social search, web scrape, or inbound ad campaign.
2. The lead is imported into the main CRM list and assigned a default pipeline stage.
3. The dashboard surfaces the prospect with a lead score, intent level, source, and deal value.
4. The user opens the lead detail modal to review notes, email drafts, call activity, and AI recommendation data.
5. Mail or voice outreach is launched from the modal or automation view.
6. Activity logs are appended to the lead timeline.
7. The pipeline stage advances as the deal moves forward.
8. State is saved so CRM changes persist across reloads.

## Page-by-page overview

### 1. Landing page

File: src/components/LandingPage.tsx

This is the public entry screen. It presents the product as a polished sales automation platform and invites users into the app.

Functions:

- Explains the product value proposition and workflow in marketing-style sections.
- Shows a small hero layout with an animated workflow preview.
- Offers navigation links for Workflow, Capabilities, and Why OmniBiz.
- Routes the user into login or app entry.

Purpose:

- Introduce the platform before the user sees the operational dashboard.
- Highlight the promise of converting prospect discovery into automated motion.

### 2. Authentication page

File: src/components/AuthPage.tsx

This is the login and account creation screen.

Functions:

- Switches between Sign in and Create account modes.
- Validates user email and password with the password policy helper.
- Supports email/password sign-in and Google OAuth sign-in.
- Calls App-level handlers to create a session or log in the user.

Purpose:

- Protect the CRM workspace and gate the internal operations from anonymous access.

### 3. Dashboard overview

File: src/components/DashboardFresh.tsx

This is the CRMs main operational homepage and command center.

Functions:

- Shows key metrics: active leads, high intent leads, pipeline value, and pending follow-ups.
- Surfaces a “next best action” panel and a quick-start guide.
- Provides a searchable recent lead list and source channel performance overview.
- Allows switching into the scraper, pipeline, automation, and campaign subviews.
- Exposes quick links for CSV export, new lead creation, and lead review.

Purpose:

- Give a revenue team an overview of the pipeline at a glance without forcing them into a specific work mode.

### 4. Scraper workbench

File: src/components/ScraperWorkbench.tsx

This is the prospect discovery engine.

Functions:

- Lets the user run Google Maps searches by keyword and location.
- Supports social discovery tasks for LinkedIn, Instagram, X/Twitter, Facebook, and TikTok.
- Allows deep web domain extraction from a URL.
- Includes a simulated inbound ad webhook flow.
- Displays live progress logs and results.
- Lets the user import a single scraped lead or batch-import many results.

Purpose:

- Turn unstructured search data into structured CRM records.

This is one of the core value drivers of the system: it converts search activity and public business metadata into sellable leads.

### 5. Pipeline board

File: src/components/PipelineKanban.tsx

This is the deal board for lead progression.

Functions:

- Organizes leads by pipeline stage.
- Supports stage filters by channel and score.
- Allows search and keyword filtering.
- Lets the user click a card to open the lead detail drawer.
- Lets the user move a lead forward or backward in the pipeline.
- Triggers confetti when a deal reaches closed won.
- Exports the currently visible pipeline as CSV.

Purpose:

- Make sales progress visible and actionable at a glance.
- Turn the CRM into a workflow board rather than a static contact list.

### 6. Automation and follow-up sequences

File: src/components/AutomationSequences.tsx

This page focuses on the operational follow-up layer.

Functions:

- Displays email cadences and their message steps.
- Shows the subject/body template preview with dynamic variable replacement.
- Provides an AI voice dialer section with lead calling presets.
- Shows a task queue for pending follow-up activities.
- Lets the user create, complete, reschedule, and delete tasks.

Purpose:

- Keep the team moving after a lead enters the system.
- Combine manual queue work with automated email and voice outreach actions.

### 7. Campaign manager

File: src/components/CampaignsManager.tsx

This module tracks acquisition channels and their performance.

Functions:

- Shows campaign metrics such as spend, leads, CPL, and pipeline revenue.
- Allows campaigns to be created and toggled between active and paused.
- Stores platform metadata like Google Ads, Meta Ads, LinkedIn Ads, and TikTok Ads.
- Provides a copyable webhook URL for inbound campaign ingestion.
- Lets the user simulate a lead on demand.

Purpose:

- Connect paid acquisition and inbound marketing to the CRM in a single place.

### 8. Lead detail modal

File: src/components/LeadDetailModal.tsx

This is the deep profile and action center for an individual lead.

Functions:

- Displays lead details, source metadata, score, intent, and deal information.
- Runs AI enrichment to update pitch suggestions and key pain points.
- Drafts personalized email follow-ups via AI.
- Sends email updates and logs delivery status in the lead timeline.
- Starts and ends a simulated AI voice call session.
- Saves notes and updated deal value.
- Updates the lead activity timeline with each action.

Purpose:

- Consolidate all lead-related activity and decision-making into one place.

### 9. Create lead modal

File: src/components/CreateLeadModal.tsx

This is the manual-input path for new business opportunities.

Functions:

- Lets the user add a company, person, title, email, phone, website, source, and deal value.
- Creates a new lead record with default status and timeline entry.
- Adds the lead directly to the pipeline.

Purpose:

- Support manual prospecting even when there is no scraper or webhook source.

### 10. Profile and settings page

File: src/components/ProfilePage.tsx

This is the workspace settings panel.

Functions:

- Updates personal details, role, company, and preferred currency.
- Controls notification toggles.
- Stores provider access keys for Google Maps, Gemini, OpenAI, Anthropic, and social platforms.
- Saves the profile and the application state.

Purpose:

- Make the CRM configurable and ready for live integrations without hardcoding secrets in the UI.

## Core server routes

The server exposes the following categories of API endpoints:

### Auth routes

- GET /api/auth/session
- DELETE /api/auth/session
- POST /api/auth/signup
- POST /api/auth/login

### App state routes

- GET /api/state
- PUT /api/state

These protect and persist CRM data such as leads, campaigns, cadences, tasks, and user profile settings.

### Outreach routes

- POST /api/outreach/email
- POST /api/outreach/call
- POST /api/outreach/callback

These trigger provider actions and update lead activity based on status callbacks.

### Campaign ingestion routes

- POST /api/campaigns/webhook

This accepts campaign leads and deduplicates them with event IDs or normalized email values.

### Scraper routes

- POST /api/scrape/maps
- POST /api/scrape/social
- POST /api/scrape/web

These generate or fetch lead data from search-based discovery systems.

## Key business logic patterns

### Lead lifecycle

A lead usually moves through the following conceptual flow:

- Ingested
- Enriched
- Contacted
- Demo scheduled
- Proposal sent
- Negotiation
- Closed won or closed lost

Stages are represented in src/types.ts and used heavily by PipelineKanban.

### Activity timeline

Every lead contains an activityTimeline array. This is the event log for the relationship and is appended whenever:

- a lead is ingested
- AI enrichment runs
- an email is sent
- a call is connected
- the stage changes
- notes are updated

This gives the CRM a strong audit trail and makes it easier to rebuild context after a user leaves and returns.

### State persistence

The app saves changes after state changes in App.tsx. It writes to:

- localStorage for client-side fallback persistence
- Firestore app state when a Firebase user is authenticated
- the Express app-state JSON file for server-side session-driven state management

## Project structure

- src/App.tsx — main application controller
- src/components/ — page and modal components
- src/services/apiService.ts — app state, auth helpers, AI, and provider integration wrappers
- src/data/initialData.ts — default seeded leads and CRM data
- src/types.ts — data models and shared types
- src/firebase.ts — Firebase initialization
- server.ts — Express API and scraping/webhook server
- API.md — backend endpoint reference
- data/app-state.json — persisted server-side CRM state

## Local development

Install dependencies:

```bash
npm install
```

Create a local environment file based on .env.example:

```bash
cp .env.example .env
```

Then fill in values for:

- Firebase config variables
- GEMINI_API_KEY
- optional provider URLs and tokens
- campaign and outreach callback secrets

Start the development stack:

```bash
npm run dev
```

This runs both the backend and Vite front end in one command.

Check types and build health:

```bash
npm run lint
npm run build
```

## Deployment notes

This app is built as a demo-ready CRM front end and can be adapted for production use by replacing the simulated provider behavior with live outbound services. The main production hardening tasks would include:

- durable database storage instead of local state files only
- secure backend auth and authorization
- real provider credentials and webhook verification
- rate limiting and audit logging
- safer secrets management in environment variables or a secret vault

## Summary

OmniBiz is a compact but complete sales command center. It merges lead discovery, AI-driven enrichment, pipeline progression, follow-up automation, and campaign performance tracking into one app. The core concept is simple: every lead is tracked from discovery to action, and every action is saved as part of the lead’s activity story.

This makes it more than a contact manager; it is a workflow engine for revenue operations.
