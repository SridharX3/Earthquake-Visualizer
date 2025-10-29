// Color coding for earthquake magnitudes
export const getMagnitudeColor = (magnitude) => {
  if (magnitude < 1) return '#4CAF50';    // Green - micro
  if (magnitude < 3) return '#8BC34A';    // Light Green - minor
  if (magnitude < 5) return '#FFC107';    // Yellow - light
  if (magnitude < 7) return '#FF9800';    // Orange - moderate
  if (magnitude < 8) return '#F44336';    // Red - strong
  return '#7B1FA2';                       // Purple - major/great
};

// Size calculation for map markers
export const getMagnitudeSize = (magnitude) => {
  return Math.max(magnitude * 8, 15);
};

// Process raw earthquake data from USGS API
export const processEarthquakeData = (data) => {
  if (!data || !data.features) return [];
  
  return data.features.map(quake => ({
    id: quake.id,
    magnitude: quake.properties.mag || 0,
    place: quake.properties.place || 'Unknown location',
    time: new Date(quake.properties.time),
    coordinates: [
      quake.geometry.coordinates[1], // latitude
      quake.geometry.coordinates[0]  // longitude
    ],
    depth: quake.geometry.coordinates[2],
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
};

// Format date for display
export const formatDate = (date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

// Format date for API requests
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

// Get descriptive magnitude level
export const getMagnitudeDescription = (magnitude) => {
  if (magnitude < 2.5) return 'Micro';
  if (magnitude < 4.5) return 'Minor';
  if (magnitude < 6.0) return 'Light';
  if (magnitude < 7.0) return 'Moderate';
  if (magnitude < 8.0) return 'Strong';
  return 'Great';
};

// Calculate days between two dates
export const calculateDaysBetween = (startDate, endDate) => {
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Validate date range for API limits
export const validateDateRange = (startDate, endDate) => {
  const daysBetween = calculateDaysBetween(startDate, endDate);
  return daysBetween <= 365;
};