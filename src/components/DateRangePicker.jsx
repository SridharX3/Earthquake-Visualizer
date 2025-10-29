import React from 'react';
import { formatDateForAPI, calculateDaysBetween, validateDateRange } from '../utils/helpers';

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    onDateChange(startDate, newEndDate);
  };

  const setQuickRange = (days) => {
    const newEndDate = new Date();
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - days);
    onDateChange(newStartDate, newEndDate);
  };

  const daysBetween = calculateDaysBetween(startDate, endDate);
  const isValidRange = validateDateRange(startDate, endDate);

  return (
    <div className="date-range-picker">
      <h4>Date Range</h4>
      
      <div className="quick-ranges">
        <button onClick={() => setQuickRange(1)}>1 Day</button>
        <button onClick={() => setQuickRange(7)}>7 Days</button>
        <button onClick={() => setQuickRange(30)}>30 Days</button>
        <button onClick={() => setQuickRange(90)}>90 Days</button>
      </div>

      <div className="date-inputs">
        <div className="date-input-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={formatDateForAPI(startDate)}
            onChange={handleStartDateChange}
            max={formatDateForAPI(endDate)}
          />
        </div>
        
        <div className="date-input-group">
          <label>End Date:</label>
          <input
            type="date"
            value={formatDateForAPI(endDate)}
            onChange={handleEndDateChange}
            min={formatDateForAPI(startDate)}
            max={formatDateForAPI(new Date())}
          />
        </div>
      </div>

      <div className="range-info">
        <span>Selected: {daysBetween} days</span>
        {!isValidRange && (
          <span className="warning">⚠️ Maximum 1 year range</span>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;