# ADADA Real Estate — Admin Dashboard Hub

A premium, high-performance administrative panel for managing real estate listings, staff roles, and incoming inquiries.

## Key Features

- **Dashboard (Vault Edition)**: Real-time monitoring of property inventory, revenue trends, and staff assignments using Recharts.
- **Advanced Property Management**: Full CRUD list with inline row filters for search, category, status, and price range.
- **Property Agent Core**: Multi-agent assignment tool with live availability tracking and search-driven filtering.
- **Inquiry Management**: Dedicated inbox for public messages via `Contact Us` form with permanent deletion and search capabilities.
- **Staff Control**: Comprehensive staff directory with granular role permissions, real-time status toggling, and manual data synchronization (Refresh).
- **Advanced Filtering**: Universal search and multi-criteria filters across all management modules.

## Aesthetic Design System

- **Glassmorphism**: Semi-transparent surfaces with backdrop-blur for a modern, depth-focused look.
- **Brand Colors**: Professional navy and primary blue accented with status-based greens and oranges.
- **Micro-animations**: Smooth hover transitions, scaling icons, and shimmering loading states.
- **Typography**: Clean, geometric fonts (Outfit/Inter) specialized for readability.

## Tech Stack

- **Framework**: React 18 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **State/Auth**: Axios with interceptors & React Router 6.
- **Charts**: Recharts (Area/Pie)

## Development Workflow

```bash
# Install Dependencies
npm install

# Start Local Developer Server
npm run dev

# Build for Production
npm run build
```

## Dashboard Overview
The **"Vault"** dashboard provides a 360-degree view of your business health:
1. **Listings**: Total, available, and completed sales.
2. **Revenue Feed**: Revenue growth visualized over the last 6 months.
3. **Asset Mix**: Pie chart showing your portfolio distribution (Apartments, Villas, Commercial).
4. **Recent Activity**: Scrolling feed of the newest entries in the property system.
