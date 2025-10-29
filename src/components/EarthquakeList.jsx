import React from 'react';

// Shared magnitude functions
const getMagnitudeColor = (magnitude) => {
  if (magnitude < 1.0) return '#4CAF50';
  if (magnitude < 3.0) return '#8BC34A';
  if (magnitude < 5.0) return '#FFC107';
  if (magnitude < 7.0) return '#FF9800';
  if (magnitude < 8.0) return '#F44336';
  return '#7B1FA2';
};

const getMagnitudeDescription = (magnitude) => {
  if (magnitude < 2.5) return 'Micro';
  if (magnitude < 4.5) return 'Minor';
  if (magnitude < 6.0) return 'Light';
  if (magnitude < 7.0) return 'Moderate';
  if (magnitude < 8.0) return 'Strong';
  return 'Great';
};

const EarthquakeList = ({ earthquakes, selectedEarthquake, onEarthquakeClick }) => {
  if (earthquakes.length === 0) {
    return (
      <div className="earthquake-list empty">
        <p>No earthquakes found</p>
        <p>Try adjusting your filters</p>
      </div>
    );
  }

  const handleEarthquakeClick = (quake) => {
    console.log('List item clicked:', quake);
    // Always call the click handler, even if it's the same earthquake
    onEarthquakeClick(quake);
  };

  return (
    <div className="earthquake-list">
      <div className="list-header">
        <h3>Earthquakes ({earthquakes.length})</h3>
        <p>Click to view on map • Scroll to see more</p>
      </div>
      
      <div className="list-items">
        {earthquakes.map(quake => {
          const isSelected = selectedEarthquake && selectedEarthquake.id === quake.id;
          
          return (
            <div 
              key={quake.id}
              className={`earthquake-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleEarthquakeClick(quake)}
            >
              <div 
                className="magnitude-indicator"
                style={{ 
                  backgroundColor: getMagnitudeColor(quake.magnitude)
                }}
              >
                {quake.magnitude.toFixed(1)}
              </div>
              
              <div className="earthquake-details">
                <h4>{quake.place}</h4>
                <p className="earthquake-time">
                  {quake.time.toLocaleDateString()} • {quake.time.toLocaleTimeString()}
                </p>
                <p className="earthquake-depth">Depth: {quake.depth} km</p>
                <p className="magnitude-type">
                  <strong>Type:</strong> {getMagnitudeDescription(quake.magnitude)}
                </p>
                
                {quake.tsunami && (
                  <span className="tsunami-indicator">🌊 Tsunami</span>
                )}
                
                {/* Removed the "Viewing on Map" indicator */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarthquakeList;