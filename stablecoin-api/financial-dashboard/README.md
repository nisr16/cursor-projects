# Financial Operations Dashboard

A comprehensive React-based operations dashboard for B2B stablecoin banking platform with interactive drill-down functionality.

## Features

### Interactive Elements
- **Clickable KPI Cards**: Click any KPI card to view detailed breakdowns and analytics
- **Interactive Bank Names**: Click bank names throughout the dashboard to view detailed bank profiles
- **Clickable Transactions**: Click transaction IDs to view comprehensive transaction details
- **Hover Effects**: Enhanced hover states and visual feedback for all interactive elements

### Navigation & Routing
- **React Router Integration**: Full client-side routing with browser navigation
- **Breadcrumb Navigation**: Easy navigation back to dashboard from detail pages
- **Deep Linking**: Direct access to specific KPI, bank, or transaction pages

### Detail Pages

#### KPI Details (`/kpi/{kpiType}`)
- Revenue breakdown with pie charts
- TPV trend analysis with line charts
- Transaction volume analytics
- Growth metrics visualization
- Historical data and forecasting

#### Bank Profiles (`/bank/{bankId}`)
- Comprehensive bank performance metrics
- Revenue and transaction trends
- Real-time health status
- Integration status and user activity
- Recent transaction history
- Performance analytics

#### Transaction Details (`/transaction/{transactionId}`)
- Complete transaction timeline
- Status updates and processing information
- Bank details and routing information
- Fee breakdown and approval workflow
- Related transaction suggestions

## Technology Stack

- **React 19** with TypeScript
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Mock Data** for demonstration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Interactive Features

### KPI Cards
- Click any KPI card (Total Revenue, TPV, Growth Rate, etc.)
- Navigate to detailed breakdown pages
- View trend charts and analytics

### Bank Interactions
- Click bank names in:
  - Live Transaction Feed
  - Active Banks list
  - Top Banks Table
  - Bank Health Table
- View comprehensive bank profiles with performance metrics

### Transaction Interactions
- Click transaction IDs in:
  - Live Transaction Feed
  - Recent Transactions
- View detailed transaction information and timeline

## URL Structure

- `/` - Main Operations Dashboard
- `/kpi/totalrevenue` - Revenue KPI Details
- `/kpi/tpv` - TPV KPI Details
- `/kpi/growthrate` - Growth Rate KPI Details
- `/bank/{bankName}` - Bank Profile Page
- `/transaction/{transactionId}` - Transaction Details Page

## Styling

All components use the existing Tailwind CSS design system with:
- Dark theme with fintech color palette
- Consistent card layouts and spacing
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Preserved animations and visual feedback

## Data Structure

The dashboard uses mock data from:
- `src/data/mockData.ts` - Financial KPIs and transaction data
- `src/data/operationsData.ts` - Real-time operations data

All interactive elements maintain data consistency across the application.
