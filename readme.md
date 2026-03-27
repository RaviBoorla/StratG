# Strat101.com - Enabling Transformation Journeys

A modern, modular SaaS-based Program Management Tool built with Next.js 14, TypeScript, Tailwind CSS, and Zustand.

Designed exactly as requested:
- Multi-tenant ready architecture (currently single-tenant demo)
- Full Kanban Board with drag & drop and advanced filters
- Complete Work Items management (Vision → Sub-Task hierarchy)
- Rich input form with **auto-save after title field**
- Side panel with details, dependencies & hierarchy view
- Reports with List / Count / Graph views + CSV export
- AI Assist (scoped only to data inside Strat101.com)
- Fully modular components (Header, Sidebar, Footer ready)

## Features

- **Work Item Types**: Vision, Mission, Goals, OKRs, Initiative, Program, Project, Task, Sub-Task
- **28+ fields** per work item including conditional Key Results for OKRs
- Auto-save on title entry
- Drag & drop Kanban with filters (Status, Risk, Impact, Priority, Health)
- Customizable Reports (Bar, Line, Pie charts + CSV export)
- AI Assistant that only knows your internal data
- Clean, responsive UI with Tailwind

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand + persist (localStorage)
- Recharts
- Lucide Icons
- UUID for IDs

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/strat101.git
cd strat101