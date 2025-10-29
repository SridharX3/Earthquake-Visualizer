import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import EarthquakeList from './components/EarthquakeList';
import Filters from './components/Filters';
import './App.css';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [filters, setFilters] = useState({
    minMagnitude: 2.5,
    maxMagnitude: 10,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date(),
    feedType: 'all_day' // Changed from '2.5_day' to match Filters component
  });

  // Load earthquakes when component mounts
  useEffect(() => {
    console.log('App mounted, loading initial earthquake data...');
    loadEarthquakes();
  }, []);

  // Main function to load earthquake data
  const loadEarthquakes = async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedEarthquake(null); // Clear selection when loading new data
      
      let apiUrl;
      
      // Choose API endpoint based on feedType
      switch(newFilters.feedType) {
        case 'all_day':
          apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
          break;
        case '4.5_day':
          apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';
          break;
        case 'significant_day':
          apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson';
          break;
        case 'custom':
          // Custom date range
          const start = newFilters.startDate.toISOString().split('T')[0];
          const end = newFilters.endDate.toISOString().split('T')[0];
          apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}&minmagnitude=${newFilters.minMagnitude}&maxmagnitude=${newFilters.maxMagnitude}&orderby=time`;
          console.log('Custom API URL:', apiUrl);
          break;
        default: // Fallback to all_day
          apiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
      }

      console.log('Fetching earthquake data from:', apiUrl);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.features) {
        throw new Error('No earthquake data found in response');
      }
      
      // Process the earthquake data
      const processedData = data.features.map(quake => ({
        id: quake.id,
        magnitude: quake.properties.mag || 0,
        place: quake.properties.place || 'Unknown location',
        time: new Date(quake.properties.time),
        coordinates: [
          quake.geometry.coordinates[1], // latitude
          quake.geometry.coordinates[0]  // longitude
        ],
        depth: quake.geometry.coordinates[2]?.toFixed(1) || 'Unknown',
        url: quake.properties.url,
        title: quake.properties.title,
        type: quake.properties.type,
        significance: quake.properties.sig || 0,
        alert: quake.properties.alert,
        tsunami: quake.properties.tsunami === 1,
        felt: quake.properties.felt,
        cdi: quake.properties.cdi,
        mmi: quake.properties.mmi
      }));
      
      // For predefined feeds, apply magnitude filtering on client side
      let filteredData = processedData;
      if (newFilters.feedType !== 'custom') {
        filteredData = processedData.filter(q => 
          q.magnitude >= newFilters.minMagnitude && 
          q.magnitude <= newFilters.maxMagnitude
        );
      }
      
      // Sort by time (most recent first)
      filteredData.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      setEarthquakes(filteredData);
      console.log(`✅ Successfully loaded ${filteredData.length} earthquakes`);
      
    } catch (error) {
      console.error('❌ Error loading earthquakes:', error);
      let errorMessage = 'Failed to load earthquake data. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Please check your internet connection.';
      } else if (error.message.includes('No earthquake data')) {
        errorMessage += 'No earthquakes found for the selected criteria.';
      } else if (error.message.includes('429')) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('400')) {
        errorMessage += 'Invalid date range or parameters. Please check your filters.';
      } else {
        errorMessage += 'Please try again later.';
      }
      
      setError(errorMessage);
      setEarthquakes([]); // Clear any previous data
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log('Filters updated:', newFilters);
    
    // Check if filters actually changed
    const filtersChanged = 
      newFilters.feedType !== filters.feedType ||
      newFilters.minMagnitude !== filters.minMagnitude ||
      newFilters.maxMagnitude !== filters.maxMagnitude ||
      newFilters.startDate.getTime() !== filters.startDate.getTime() ||
      newFilters.endDate.getTime() !== filters.endDate.getTime();
    
    setFilters(newFilters);
    
    // For all feed types including custom, load immediately if filters changed
    if (filtersChanged) {
      loadEarthquakes(newFilters);
    }
  };

  // Handle explicit submit for custom date ranges
  const handleSubmitCustomRange = async (customFilters) => {
    console.log('Submitting custom range:', customFilters);
    await loadEarthquakes(customFilters);
  };

  // Handle earthquake selection
  const handleEarthquakeClick = (earthquake) => {
    console.log('Earthquake selected:', earthquake);
    setSelectedEarthquake(earthquake);
  };

  // Close earthquake details
  const handleCloseDetails = () => {
    setSelectedEarthquake(null);
  };

  // Retry loading data
  const handleRetry = () => {
    setError(null);
    loadEarthquakes();
  };

  // Get status message for UI
  const getStatusMessage = () => {
    if (loading) return 'Loading earthquake data...';
    if (error) return 'Error loading data';
    if (earthquakes.length === 0) return 'No earthquakes found';
    return `${earthquakes.length} earthquakes loaded`;
  };

  // Get status class for styling
  const getStatusClass = () => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (earthquakes.length === 0) return 'empty';
    return 'success';
  };

  // Calculate days between dates for custom range
  const getDaysBetweenDates = () => {
    if (filters.feedType !== 'custom') return 0;
    const diffTime = Math.abs(filters.endDate - filters.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🌍 Earthquake Visualizer</h1>
          <p>Real-time and historical earthquake data from USGS</p>
          <div className="status-info">
            <span className={`status ${getStatusClass()}`}>
              {getStatusMessage()}
            </span>
            {filters.feedType === 'custom' && (
              <span className="date-range">
                {filters.startDate.toLocaleDateString()} → {filters.endDate.toLocaleDateString()}
                {` (${getDaysBetweenDates()} days)`}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button onClick={handleRetry} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Filters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onSubmitCustomRange={handleSubmitCustomRange}
        loading={loading}
      />

      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading earthquake data...</p>
            <p className="loading-subtext">Fetching from USGS Earthquake API</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Failed to Load Data</h3>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : earthquakes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌋</div>
            <h3>No Earthquakes Found</h3>
            <p>Try adjusting your filters or select a different time range.</p>
            <button onClick={handleRetry} className="retry-btn">
              Reload Data
            </button>
          </div>
        ) : (
          <>
            {/* Map Section */}
            <div className="map-section">
              <MapComponent 
                earthquakes={earthquakes} 
                selectedEarthquake={selectedEarthquake}
                onEarthquakeClick={handleEarthquakeClick}
                onCloseDetails={handleCloseDetails}
              />
            </div>
            
            {/* List Section */}
            <div className="list-section">
              <EarthquakeList 
                earthquakes={earthquakes}
                selectedEarthquake={selectedEarthquake}
                onEarthquakeClick={handleEarthquakeClick}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Data provided by{' '}
            <a 
              href="https://earthquake.usgs.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="usgs-link"
            >
              USGS Earthquake Hazards Program
            </a>
          </p>
          <p className="footer-note">
            Updates in real-time • Magnitude 2.5+ shown by default
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;