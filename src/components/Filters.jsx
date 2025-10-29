import React, { useState, useEffect } from 'react';

const Filters = ({ filters, onFilterChange, onSubmitCustomRange, loading }) => {
  const [localDates, setLocalDates] = useState({
    startDate: filters.startDate,
    endDate: filters.endDate
  });

  const [dateErrors, setDateErrors] = useState({
    startDate: '',
    endDate: ''
  });

  const [selectedFeedType, setSelectedFeedType] = useState('custom');
  const [selectedDays, setSelectedDays] = useState(7); // Default to 7 days

  // Sync local dates when filters prop changes
  useEffect(() => {
    setLocalDates({
      startDate: filters.startDate,
      endDate: filters.endDate
    });
  }, [filters.startDate, filters.endDate]);

  const handleFeedTypeChange = (feedType, days = null) => {
    setSelectedFeedType(feedType);
    
    if (days) {
      setSelectedDays(days);
      
      if (days === 'custom') {
        // For "Custom Dates" option, set default range and show inputs
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // Default to last 7 days
        
        setLocalDates({ startDate, endDate });
        setDateErrors({ startDate: '', endDate: '' });
        
        // Update filters to show custom date inputs but don't submit yet
        onFilterChange({
          ...filters,
          feedType: 'custom',
          startDate,
          endDate
        });
      } else {
        // For preset ranges, immediately submit
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        setLocalDates({ startDate, endDate });
        setDateErrors({ startDate: '', endDate: '' });
        
        onSubmitCustomRange({
          ...filters,
          startDate,
          endDate,
          feedType: 'custom'
        });
      }
    } else {
      // Handle regular feed type change
      onFilterChange({
        ...filters,
        feedType
      });
    }
  };

  const handleMagnitudeChange = (min, max) => {
    onFilterChange({
      ...filters,
      minMagnitude: min,
      maxMagnitude: max
    });
  };

  const handleDateChange = (type, value) => {
    // Clear errors when user starts typing
    setDateErrors(prev => ({ ...prev, [type]: '' }));

    if (!value) {
      setDateErrors(prev => ({ 
        ...prev, 
        [type]: 'Please enter a valid date' 
      }));
      return;
    }

    const newDate = new Date(value);
    
    // Validate date - prevent future dates
    if (isNaN(newDate.getTime())) {
      setDateErrors(prev => ({ 
        ...prev, 
        [type]: 'Invalid date format' 
      }));
      return;
    }

    // Prevent future dates
    if (newDate > new Date()) {
      setDateErrors(prev => ({ 
        ...prev, 
        [type]: 'Cannot select future dates' 
      }));
      return;
    }

    const newDates = {
      ...localDates,
      [type]: newDate
    };
    setLocalDates(newDates);

    // Validate date range
    if (type === 'startDate' && newDate > localDates.endDate) {
      setDateErrors(prev => ({ 
        ...prev, 
        startDate: 'Start date cannot be after end date' 
      }));
    } else if (type === 'endDate' && newDate < localDates.startDate) {
      setDateErrors(prev => ({ 
        ...prev, 
        endDate: 'End date cannot be before start date' 
      }));
    }
  };

  const handleDateInput = (type, e) => {
    const value = e.target.value;
    
    // Allow empty input for backspace/delete
    if (value === '') {
      setDateErrors(prev => ({ ...prev, [type]: '' }));
      return;
    }

    handleDateChange(type, value);
  };

  const handleSubmitCustomRange = () => {
    // Validate dates before submitting
    const errors = {};
    
    if (!localDates.startDate || isNaN(localDates.startDate.getTime())) {
      errors.startDate = 'Please enter a valid start date';
    }
    
    if (!localDates.endDate || isNaN(localDates.endDate.getTime())) {
      errors.endDate = 'Please enter a valid end date';
    }
    
    if (localDates.startDate > localDates.endDate) {
      errors.startDate = 'Start date cannot be after end date';
    }

    // Additional validation: ensure dates are not the same (which would return no results)
    const diffTime = Math.abs(localDates.endDate - localDates.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      errors.startDate = 'Start and end date cannot be the same';
    }

    if (Object.keys(errors).length > 0) {
      setDateErrors(errors);
      return;
    }

    // Clear errors if validation passes
    setDateErrors({ startDate: '', endDate: '' });
    
    onSubmitCustomRange({
      ...filters,
      startDate: localDates.startDate,
      endDate: localDates.endDate,
      feedType: 'custom'
    });
  };

  const feedTypes = [
    { 
      value: 'custom', 
      days: 1,
      label: 'Last 24 Hours', 
      description: 'Recent earthquakes from the past 24 hours',
      icon: '🕐'
    },
    { 
      value: 'custom', 
      days: 7,
      label: 'Last 7 Days', 
      description: 'Past week of activity',
      icon: '📅'
    },
    { 
      value: 'custom', 
      days: 30,
      label: 'Last 30 Days', 
      description: 'Past month overview',
      icon: '🗓️'
    },
    { 
      value: 'custom', 
      days: 90,
      label: 'Last 90 Days', 
      description: 'Quarterly perspective',
      icon: '📆'
    },
    { 
      value: 'custom', 
      days: 'custom',
      label: 'Custom Dates', 
      description: 'Choose specific date range',
      icon: '📋'
    }
  ];

  const magnitudePresets = [
    { label: 'All', min: 0, max: 10 },
    { label: 'Minor (2.5-4.4)', min: 2.5, max: 4.4 },
    { label: 'Light (4.5-5.9)', min: 4.5, max: 5.9 },
    { label: 'Moderate+ (6+)', min: 6, max: 10 }
  ];

  const calculateDays = () => {
    const diffTime = Math.abs(localDates.endDate - localDates.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const hasDateErrors = dateErrors.startDate || dateErrors.endDate;
  
  // Check if dates have changed from last submitted
  const hasDateChanges = 
    localDates.startDate.getTime() !== filters.startDate.getTime() || 
    localDates.endDate.getTime() !== filters.endDate.getTime();
  
  // Check if dates are valid for manual submission
  const canSubmitManual = !hasDateErrors && 
                         localDates.startDate && 
                         localDates.endDate && 
                         !isNaN(localDates.startDate.getTime()) && 
                         !isNaN(localDates.endDate.getTime()) &&
                         localDates.startDate <= localDates.endDate &&
                         calculateDays() > 0 && // Ensure at least 1 day difference
                         hasDateChanges;

  // Check if we should show custom date inputs
  const showCustomDateInputs = selectedDays === 'custom';

  return (
    <div className="filters">
      <div className="filters-content">
        <h3>🌋 Data Source</h3>
        
        <div className="feed-types-buttons">
          {feedTypes.map(source => (
            <button
              key={`${source.value}-${source.days || 'default'}`}
              className={`feed-type-btn ${
                selectedDays === source.days ? 'active' : ''
              }`}
              onClick={() => !loading && handleFeedTypeChange(source.value, source.days)}
              disabled={loading}
              type="button"
            >
              <span className="feed-icon">{source.icon}</span>
              <div className="feed-text">
                <div className="feed-label">{source.label}</div>
                <div className="feed-description">{source.description}</div>
              </div>
              {loading && selectedDays === source.days && (
                <span className="loading-indicator">⟳</span>
              )}
            </button>
          ))}
        </div>

        <div className="filter-section">
          <h4>📏 Magnitude Range</h4>
          
          <div className="magnitude-presets">
            {magnitudePresets.map(preset => (
              <button
                key={preset.label}
                className={`preset-btn ${
                  filters.minMagnitude === preset.min && filters.maxMagnitude === preset.max ? 'active' : ''
                }`}
                onClick={() => !loading && handleMagnitudeChange(preset.min, preset.max)}
                disabled={loading}
                type="button"
              >
                {preset.label}
                {loading && filters.minMagnitude === preset.min && filters.maxMagnitude === preset.max && (
                  <span className="loading-small">⟳</span>
                )}
              </button>
            ))}
          </div>

          <div className="current-range">
            Current range: <strong>{filters.minMagnitude} - {filters.maxMagnitude}</strong>
            {loading && <span className="loading-small"> ⟳</span>}
          </div>
        </div>

        {showCustomDateInputs && (
          <div className="filter-section custom-dates">
            <h4>📅 Custom Date Range</h4>

            <div className="date-inputs">
              <div className="input-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={localDates.startDate.toISOString().split('T')[0]}
                  onChange={(e) => handleDateInput('startDate', e)}
                  onBlur={(e) => handleDateChange('startDate', e.target.value)}
                  disabled={loading}
                  max={localDates.endDate.toISOString().split('T')[0]}
                  className={dateErrors.startDate ? 'error' : ''}
                />
                {dateErrors.startDate && (
                  <span className="error-message">{dateErrors.startDate}</span>
                )}
              </div>
              <div className="input-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={localDates.endDate.toISOString().split('T')[0]}
                  onChange={(e) => handleDateInput('endDate', e)}
                  onBlur={(e) => handleDateChange('endDate', e.target.value)}
                  disabled={loading}
                  min={localDates.startDate.toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                  className={dateErrors.endDate ? 'error' : ''}
                />
                {dateErrors.endDate && (
                  <span className="error-message">{dateErrors.endDate}</span>
                )}
              </div>
            </div>

            <div className="date-info">
              <span className="days-count">
                {calculateDays()} days selected
                {loading && <span className="loading-small"> ⟳</span>}
              </span>
              <span className="date-range">
                {localDates.startDate.toLocaleDateString()} → {localDates.endDate.toLocaleDateString()}
              </span>
            </div>

            {/* Manual Load Button */}
            <div className="submit-section">
              <button 
                className="submit-btn"
                onClick={handleSubmitCustomRange}
                disabled={loading || !canSubmitManual}
                type="button"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Loading...
                  </>
                ) : (
                  'Load Earthquakes'
                )}
              </button>
            </div>

            {hasDateErrors && (
              <div className="date-error-summary">
                ⚠️ Please fix the date errors above before loading earthquakes.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;