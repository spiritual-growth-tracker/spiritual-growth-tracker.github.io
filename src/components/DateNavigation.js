import React, { useEffect, useRef, useState } from 'react';
import { formatDate, parseDate, isToday } from '../utils/dateUtils';

const DateNavigation = ({ selectedDate, onDateChange }) => {
  const inputRef = useRef(null);
  const flatpickrInstance = useRef(null);
  const [useNativeInput, setUseNativeInput] = useState(false);

  const handleDateChange = (selectedDates, dateStr) => {
    console.log('Date changed:', dateStr);
    onDateChange(dateStr);
  };

  const handlePrevDate = () => {
    const currentDate = parseDate(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    onDateChange(formatDate(currentDate));
  };

  const handleNextDate = () => {
    const currentDate = parseDate(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    onDateChange(formatDate(currentDate));
  };

  const handleNativeDateChange = (e) => {
    onDateChange(e.target.value);
  };

  useEffect(() => {
    console.log('DateNavigation mounted, inputRef:', inputRef.current);
    
    // Try to initialize flatpickr
    const initFlatpickr = async () => {
      try {
        const flatpickr = await import('flatpickr');
        console.log('Flatpickr imported successfully');
        
        if (inputRef.current) {
          console.log('Initializing flatpickr on input');
          
          flatpickrInstance.current = flatpickr.default(inputRef.current, {
            dateFormat: 'Y-m-d',
            maxDate: 'today',
            clickOpens: true,
            allowInput: false,
            onChange: handleDateChange,
            onOpen: function(selectedDates, dateStr, instance) {
              console.log('Flatpickr opened successfully');
            },
            onClose: function(selectedDates, dateStr, instance) {
              console.log('Flatpickr closed');
            }
          });
          
          console.log('Flatpickr instance created:', flatpickrInstance.current);
        }
      } catch (error) {
        console.error('Failed to initialize flatpickr:', error);
        setUseNativeInput(true);
      }
    };

    const timer = setTimeout(initFlatpickr, 100);

    return () => {
      clearTimeout(timer);
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (flatpickrInstance.current && !useNativeInput) {
      flatpickrInstance.current.setDate(selectedDate, false);
    }
  }, [selectedDate, useNativeInput]);

  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (useNativeInput) {
      console.log('Using native date input');
      return;
    }
    
    console.log('Input clicked, opening flatpickr...');
    if (flatpickrInstance.current) {
      try {
        flatpickrInstance.current.open();
      } catch (error) {
        console.error('Error opening flatpickr:', error);
        setUseNativeInput(true);
      }
    } else {
      console.log('No flatpickr instance, falling back to native input');
      setUseNativeInput(true);
    }
  };

  const handleCalendarIconClick = () => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.open();
    }
  };

  return (
    <div className="date-navigation mb-4">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handlePrevDate}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="input-group">
          {useNativeInput ? (
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleNativeDateChange}
              max={formatDate(new Date())}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              className="form-control flatpickr-input"
              value={selectedDate}
              readOnly
              placeholder="Select date"
              style={{ cursor: 'pointer' }}
            />
          )}
          {!useNativeInput && (
            <span 
              className="input-group-text"
              onClick={handleCalendarIconClick}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-calendar"></i>
            </span>
          )}
        </div>
        <button 
          type="button" 
          className="btn btn-secondary"
          disabled={isToday(parseDate(selectedDate))}
          onClick={handleNextDate}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      
      {/* Debug info */}
      <div className="mt-2 text-center">
        <small className="text-muted">
          {useNativeInput ? 'Using native date input' : 'Click the input or calendar icon to open date picker'}
        </small>
      </div>
    </div>
  );
};

export default DateNavigation; 