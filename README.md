# Earthquake Visualizer

A real-time earthquake data visualization application built with React and Leaflet that displays earthquake data from the USGS Earthquake Hazards Program.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Components Overview](#components-overview)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

### 🌍 Real-time Data Visualization
- Live earthquake feeds from USGS
- Multiple data sources (all day, significant, 4.5+ magnitude)
- Custom date range selection for historical data

### 🗺️ Interactive Map
- Leaflet-based interactive maps
- Color-coded markers based on earthquake magnitude
- Fullscreen mode support
- Dynamic zoom limits
- Popup details on marker click

### ⚡ Advanced Filtering
- Magnitude range filtering
- Pre-set time periods (24h, 7d, 30d, 90d)
- Custom date range picker
- Real-time filter updates

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Sortable earthquake list
- Detailed information panels
- Smooth loading states

## Technology Stack

- **Frontend Framework**: React 18.2.0
- **Mapping Library**: Leaflet 1.9.4 + React-Leaflet 4.2.1
- **Styling**: CSS3 with responsive design
- **Data Source**: USGS Earthquake API
- **Build Tool**: Create React App

## Project Structure

```
earthquake-visualizer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MapComponent.jsx
│   │   ├── EarthquakeList.jsx
│   │   ├── Filters.jsx
│   │   ├── DateRangePicker.jsx
│   │   ├── EarthquakeDetails.jsx
│   │   └── LoadingSpinner.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/earthquake-visualizer.git
   cd earthquake-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## API Integration

### USGS Endpoints
- **All Day Feed**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- **4.5+ Magnitude**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`
- **Custom Query**: `https://earthquake.usgs.gov/fdsnws/event/1/query`

### Data Fields
- Magnitude, location, depth, and time
- Geographic coordinates (latitude, longitude)
- Tsunami alerts and significance scores
- USGS detail URLs for more information

## Components Overview

### MapComponent.jsx
- Interactive Leaflet map implementation
- Custom earthquake markers with magnitude-based coloring
- Fullscreen functionality
- Dynamic zoom controls and limits

### Filters.jsx
- Magnitude range selection
- Time period quick-select buttons
- Custom date range picker integration
- Real-time filter application

### EarthquakeList.jsx
- Sortable list of earthquakes
- Selection handling for map focus
- Responsive design for mobile devices

### EarthquakeDetails.jsx
- Comprehensive earthquake information display
- USGS report links
- Alert and tsunami indicators

## Configuration

### Environment Variables
Create a `.env` file in the root directory for custom configuration:

```env
REACT_APP_USGS_BASE_URL=https://earthquake.usgs.gov
REACT_APP_DEFAULT_MAGNITUDE=2.5
REACT_APP_DEFAULT_DAYS=7
REACT_APP_MAX_ZOOM_LEVEL=18
```

### Magnitude Color Scheme
- **Micro (< 3.0)**: #4CAF50 (Green)
- **Light (3.0-5.0)**: #FFC107 (Yellow)
- **Moderate (5.0-7.0)**: #FF9800 (Orange)
- **Strong (7.0-8.0)**: #F44336 (Red)
- **Great (8.0+)**: #7B1FA2 (Purple)

## Deployment

### Building for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

### Deployment - Live Demo
- The application is currently deployed and available at:
https://6901e7d95178081444e7e69d--velvety-platypus-5bfc8c.netlify.app/

## Troubleshooting

### Common Issues

#### Map Markers Not Displaying
- Verify Leaflet CSS is properly imported
- Check browser console for API errors
- Ensure USGS service is accessible

#### Filter Issues
- Confirm date formats are compatible
- Check network tab for failed API calls
- Verify magnitude range logic

#### Fullscreen Problems
- Ensure browser supports Fullscreen API
- Check for CSS conflicts with map container

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Getting Help
1. Check the browser console for error messages
2. Verify all dependencies are correctly installed
3. Ensure your Node.js version is compatible
4. Check network connectivity to USGS APIs

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Additional Resources
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React-Leaflet Documentation](https://react-leaflet.js.org/)
- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/)

## Acknowledgments

- USGS Earthquake Hazards Program for providing earthquake data
- Leaflet team for the robust mapping library
- React Leaflet for seamless React integration
- OpenStreetMap contributors for map tiles

---

**Built for earthquake awareness and education**

*Note: This application is for informational purposes only. Always follow official guidance during seismic events.*
