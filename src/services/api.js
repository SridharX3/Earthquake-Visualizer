import axios from 'axios';

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const FEED_BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

export const fetchEarthquakes = async (filters = {}) => {
  const {
    startDate = new Date(Date.now() - 24 * 60 * 60 * 1000), // Default: 1 day
    endDate = new Date(),
    minMagnitude = 0,
    maxMagnitude = 10,
    feedType = 'custom' // 'custom', 'all_day', 'significant', '4.5_day', '2.5_day'
  } = filters;

  try {
    let url;
    
    if (feedType === 'custom') {
      const params = new URLSearchParams({
        format: 'geojson',
        starttime: startDate.toISOString().split('T')[0],
        endtime: endDate.toISOString().split('T')[0],
        minmagnitude: minMagnitude.toString(),
        maxmagnitude: maxMagnitude.toString(),
        orderby: 'time'
      });
      
      url = `${BASE_URL}?${params}`;
    } else {
      // Use predefined feeds
      url = `${FEED_BASE_URL}/${feedType}.geojson`;
    }

    console.log('Fetching from:', url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw new Error('Failed to fetch earthquake data from USGS API');
  }
};

export const fetchFeed = async (feedType = 'all_day') => {
  try {
    const response = await axios.get(`${FEED_BASE_URL}/${feedType}.geojson`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};