import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Magnitude color function
const getMagnitudeColor = (magnitude) => {
  if (magnitude < 1.0) return '#4CAF50';
  if (magnitude < 3.0) return '#8BC34A';
  if (magnitude < 5.0) return '#FFC107';
  if (magnitude < 7.0) return '#FF9800';
  if (magnitude < 8.0) return '#F44336';
  return '#7B1FA2';
};

// Custom earthquake marker
const createEarthquakeIcon = (magnitude, isSelected = false) => {
  const size = isSelected ? 30 : 25;
  const borderWidth = isSelected ? 4 : 2;
  
  return L.divIcon({
    className: 'custom-earthquake-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${getMagnitudeColor(magnitude)};
        border: ${borderWidth}px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isSelected ? '12px' : '10px'};
        cursor: pointer;
      ">${magnitude.toFixed(1)}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Map controller component for flying to locations and calculating min zoom
const MapController = ({ selectedEarthquake, onMinZoomCalculated }) => {
  const map = useMap();
  const lastSelectedId = useRef(null);
  const minZoomCalculated = useRef(false);

  useEffect(() => {
    if (selectedEarthquake) {
      const { coordinates } = selectedEarthquake;
      map.flyTo([coordinates[0], coordinates[1]], 8, {
        duration: 1.5
      });
      lastSelectedId.current = selectedEarthquake.id;
    }
  }, [selectedEarthquake, map]);

  // Calculate and set minimum zoom based on container size
  useEffect(() => {
    const calculateMinZoom = () => {
      const container = map.getContainer();
      if (!container) return;

      // Get container dimensions
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // World dimensions in pixels at zoom level 0
      const worldWidth = 256; // Tile size at zoom 0
      const worldHeight = 256; // Tile size at zoom 0

      // Calculate the zoom level where world fits exactly in container
      const zoomX = Math.log2(containerWidth / worldWidth);
      const zoomY = Math.log2(containerHeight / worldHeight);
      
      // Use the smaller zoom level to ensure entire world fits
      const calculatedMinZoom = Math.min(zoomX, zoomY);
      
      // Set a reasonable minimum (usually around 1-2 for most screen sizes)
      const finalMinZoom = Math.max(1, Math.floor(calculatedMinZoom));
      
      if (!minZoomCalculated.current && onMinZoomCalculated) {
        onMinZoomCalculated(finalMinZoom);
        minZoomCalculated.current = true;
      }
    };

    // Calculate after a brief delay to ensure container is rendered
    const timer = setTimeout(calculateMinZoom, 100);
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateMinZoom);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateMinZoom);
    };
  }, [map, onMinZoomCalculated]);

  return null;
};

// Fullscreen control component
const FullscreenControl = () => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const mapContainer = map.getContainer();
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
      } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={toggleFullscreen}
          style={{
            width: '36px',
            height: '36px',
            border: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? '⤵️' : '⤴️'}
        </button>
      </div>
    </div>
  );
};

const MapComponent = ({ earthquakes, selectedEarthquake, onEarthquakeClick, onCloseDetails }) => {
  const [minZoom, setMinZoom] = useState(1); // Default minimum zoom

  const handleMarkerClick = (earthquake) => {
    console.log('Marker clicked:', earthquake);
    onEarthquakeClick(earthquake);
  };

  const handleMapClick = () => {
    if (selectedEarthquake) {
      onCloseDetails();
    }
  };

  const handleMinZoomCalculated = (calculatedMinZoom) => {
    console.log('Calculated minimum zoom:', calculatedMinZoom);
    setMinZoom(calculatedMinZoom);
  };

  return (
    <div className="map-container" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={minZoom} // Dynamic minimum zoom based on container size
        maxZoom={18}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
        worldCopyJump={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        
        <MapController 
          selectedEarthquake={selectedEarthquake} 
          onMinZoomCalculated={handleMinZoomCalculated}
        />
        <FullscreenControl />
        
        {earthquakes.map(quake => (
          <Marker
            key={quake.id}
            position={[quake.coordinates[0], quake.coordinates[1]]}
            icon={createEarthquakeIcon(quake.magnitude, selectedEarthquake?.id === quake.id)}
            eventHandlers={{
              click: () => handleMarkerClick(quake)
            }}
          >
            <Popup>
              <div className="earthquake-popup">
                <h3>Magnitude {quake.magnitude.toFixed(1)}</h3>
                <p><strong>Location:</strong> {quake.place}</p>
                <p><strong>Time:</strong> {quake.time.toLocaleString()}</p>
                <p><strong>Depth:</strong> {quake.depth} km</p>
                {quake.tsunami && <p><strong>🌊 Tsunami Warning</strong></p>}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(quake.url, '_blank');
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  More Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <h4>Earthquake Magnitude</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Micro (&lt; 3.0)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFC107' }}></div>
            <span>Light (3.0-5.0)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
            <span>Moderate (5.0-7.0)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
            <span>Strong (7.0-8.0)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#7B1FA2' }}></div>
            <span>Great (8.0+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;