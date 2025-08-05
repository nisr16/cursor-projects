# Analytics Dashboard Frontend

A comprehensive React-based analytics dashboard for USDC banking operations with real-time data visualization, interactive charts, and responsive design.

## 🚀 Features

### 📊 Analytics Dashboard
- **Tabbed Interface**: Overview, Performance, Liquidity, and Compliance tabs
- **KPI Cards**: Real-time metrics with trend indicators
- **Interactive Charts**: Area, bar, pie, and line charts using Recharts
- **Time Period Selector**: 7d, 30d, 90d, 1y filtering
- **Real-time Updates**: Auto-refresh capability
- **Export Functionality**: PDF report generation
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error states with retry options
- **Accessibility**: WCAG compliant with focus management
- **Dark Mode Ready**: Prepared for theme switching
- **Print Styles**: Optimized for report printing

### 📈 Data Visualization
- **Volume Trends**: Area charts showing transfer volume over time
- **Transfer Types**: Pie charts for transfer type distribution
- **Network Performance**: Bar charts for network comparison
- **Cost Savings**: Visual representation of SWIFT vs Nexora savings
- **Success Rates**: Performance metrics by network

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Recharts**: Professional charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **PostCSS**: CSS processing
- **ESLint**: Code quality and consistency

## 📦 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

### API Endpoints
The dashboard connects to these analytics API endpoints:

- `GET /api/analytics/dashboard/:bankId` - Comprehensive dashboard data
- `GET /api/analytics/kpis/:bankId` - Key performance indicators
- `GET /api/analytics/trends/:bankId` - Volume trends
- `GET /api/analytics/transfer-types/:bankId` - Transfer type distribution
- `GET /api/analytics/network-performance/:bankId` - Network performance
- `GET /api/analytics/cost-savings/:bankId` - Cost savings analysis

## 📱 Usage

### Basic Implementation
```jsx
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';

function App() {
  return (
    <AnalyticsDashboard 
      bankId="550e8400-e29b-41d4-a716-446655440000"
      initialPeriod="30d"
    />
  );
}
```

### Props
- `bankId` (string, required): Bank UUID for analytics data
- `initialPeriod` (string, optional): Initial time period (7d, 30d, 90d, 1y)

## 🎯 Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── analytics/
│   │       └── AnalyticsDashboard.jsx    # Main dashboard component
│   ├── index.css                         # Tailwind CSS imports
│   └── index.js                          # React app entry point
├── package.json                          # Dependencies and scripts
├── tailwind.config.js                    # Tailwind configuration
├── postcss.config.js                     # PostCSS configuration
└── README.md                            # This file
```

## 🎨 Customization

### Colors
Modify the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Your brand colors */ },
  success: { /* Success state colors */ },
  warning: { /* Warning state colors */ },
  danger: { /* Error state colors */ }
}
```

### Charts
Customize chart colors in `AnalyticsDashboard.jsx`:

```javascript
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  // ... add your colors
};
```

### Styling
Add custom styles in `src/index.css`:

```css
@layer components {
  .your-custom-class {
    @apply your-tailwind-classes;
  }
}
```

## 📊 Data Format

### KPI Data Structure
```javascript
{
  total_transfers: 150,
  total_volume: 2500000.00,
  total_fees: 2500.00,
  avg_settlement_time: 30.5,
  success_rate: 98.5,
  cost_savings: 10000.00,
  estimated_swift_fees: 12500.00,
  savings_percentage: '80.00'
}
```

### Chart Data Structure
```javascript
// Volume Trends
[
  {
    date: '2024-01-01',
    volume: 500000.00,
    transfers: 25,
    fees: 500.00
  }
]

// Transfer Types
[
  {
    transfer_type: 'interbank',
    count: 100,
    percentage: '66.67',
    volume: 1500000.00
  }
]

// Network Performance
[
  {
    network: 'polygon',
    total_transfers: 80,
    volume: 1200000.00,
    success_rate: 99.2,
    cost_savings: 8000.00
  }
]
```

## 🔄 Real-time Updates

The dashboard supports real-time updates with:

- **Auto-refresh**: Toggle automatic data refresh
- **Manual refresh**: Click refresh button
- **Period changes**: Automatic data refetch on period change
- **Error recovery**: Automatic retry on connection errors

## 📱 Responsive Design

The dashboard is fully responsive with:

- **Mobile**: Single column layout, touch-friendly controls
- **Tablet**: Two-column grid, optimized spacing
- **Desktop**: Full three-column layout, hover effects
- **Large screens**: Maximum width container, enhanced spacing

## 🎯 Performance Optimizations

- **Lazy loading**: Charts load on demand
- **Memoization**: React.memo for expensive components
- **Debounced updates**: Prevents excessive API calls
- **Optimized re-renders**: useCallback and useMemo hooks
- **Bundle splitting**: Code splitting for better loading

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment-specific Builds
```bash
# Development
REACT_APP_ENVIRONMENT=development npm run build

# Production
REACT_APP_ENVIRONMENT=production npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm lint` - Run ESLint
- `npm lint:fix` - Fix ESLint issues
- `npm format` - Format code with Prettier

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript Ready**: Prepared for TypeScript migration
- **Accessibility**: ARIA labels and keyboard navigation

## 📈 Analytics Features

### KPI Metrics
- **Total Cost Savings**: Money saved vs SWIFT
- **Average Settlement Time**: Transfer completion time
- **Transfer Volume**: Total transaction volume
- **Success Rate**: Percentage of successful transfers
- **Idle Capital Reduction**: Reduced capital requirements
- **Cost Reduction vs SWIFT**: Percentage savings

### Chart Types
- **Area Charts**: Volume trends over time
- **Pie Charts**: Transfer type distribution
- **Bar Charts**: Network performance comparison
- **Line Charts**: Time series data visualization

### Export Features
- **PDF Reports**: Comprehensive analytics reports
- **Data Export**: CSV/JSON data export
- **Chart Export**: High-resolution chart images
- **Custom Periods**: Flexible date range selection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation
- Contact the development team

---

**Built with ❤️ for modern banking analytics** 