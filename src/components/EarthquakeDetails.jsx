import React from 'react';

const EarthquakeDetails = ({ earthquake, onClose }) => {
  const getMagnitudeColor = (magnitude) => {
    if (magnitude < 3) return '#4CAF50';
    if (magnitude < 5) return '#FFC107';
    if (magnitude < 7) return '#FF9800';
    return '#F44336';
  };

  const getMagnitudeDescription = (magnitude) => {
    if (magnitude < 2.5) return 'Micro';
    if (magnitude < 4.5) return 'Minor';
    if (magnitude < 6.0) return 'Light';
    if (magnitude < 7.0) return 'Moderate';
    return 'Strong';
  };

  if (!earthquake) return null;

  return (
    <div className="earthquake-details-overlay" onClick={onClose}>
      <div className="earthquake-details" onClick={e => e.stopPropagation()}>
        <div className="details-header">
          <h2>Earthquake Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="details-content">
          <div className="magnitude-display">
            <div 
              className="magnitude-circle"
              style={{ backgroundColor: getMagnitudeColor(earthquake.magnitude) }}
            >
              <span className="magnitude-value">{earthquake.magnitude.toFixed(1)}</span>
              <span className="magnitude-type">{getMagnitudeDescription(earthquake.magnitude)}</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{earthquake.place}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Time:</span>
              <span className="value">{earthquake.time.toLocaleString()}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Depth:</span>
              <span className="value">{earthquake.depth} km</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Significance:</span>
              <span className="value">{earthquake.significance}</span>
            </div>
            
            {earthquake.alert && (
              <div className="detail-row">
                <span className="label">Alert:</span>
                <span className="value alert">{earthquake.alert}</span>
              </div>
            )}
            
            {earthquake.tsunami && (
              <div className="detail-row">
                <span className="label">Tsunami:</span>
                <span className="value tsunami">🌊 Tsunami Possible</span>
              </div>
            )}
          </div>

          <div className="details-actions">
            <a 
              href={earthquake.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="usgs-link"
            >
              View on USGS Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeDetails;