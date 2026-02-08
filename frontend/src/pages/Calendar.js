import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    { date: '2026-02-10', title: 'Application Deadline - PM-KISAN', type: 'deadline' },
    { date: '2026-02-15', title: 'New Scheme Launch', type: 'event' },
    { date: '2026-02-20', title: 'Document Verification Day', type: 'reminder' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesHindi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateHindi = (date) => {
    const day = date.getDate();
    const month = monthNamesHindi[date.getMonth()];
    const year = date.getFullYear();
    const weekday = dayNamesHindi[date.getDay()];
    return `${weekday}, ${day} ${month} ${year}`;
  };

  const hasEvent = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return events.some(event => event.date === dateStr);
  };

  const getEvent = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return events.find(event => event.date === dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="calendar-widget">
      {/* Live Clock */}
      <div className="live-clock">
        <div className="clock-time">{formatTime(currentTime)}</div>
        <div className="clock-date">{formatDate(currentTime)}</div>
        <div className="clock-date-hindi">{formatDateHindi(currentTime)}</div>
      </div>

      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav">‹</button>
        <div className="calendar-title">
          <div className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div className="month-year-hindi">
            {monthNamesHindi[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
        </div>
        <button onClick={nextMonth} className="calendar-nav">›</button>
      </div>

      <button onClick={goToToday} className="today-btn">Today | आज</button>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        {dayNames.map((day, index) => (
          <div key={day} className="calendar-day-header">
            <div>{day}</div>
            <div className="day-hindi">{dayNamesHindi[index]}</div>
          </div>
        ))}

        {/* Calendar Days */}
        {getDaysInMonth(currentDate).map((date, index) => (
          <div
            key={index}
            className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${hasEvent(date) ? 'has-event' : ''}`}
            onClick={() => date && setSelectedDate(date)}
          >
            {date && (
              <>
                <span className="day-number">{date.getDate()}</span>
                {hasEvent(date) && <span className="event-dot"></span>}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Events List */}
      {selectedDate && (
        <div className="selected-date-info">
          <h4>📅 {formatDate(selectedDate)}</h4>
          {getEvent(selectedDate) ? (
            <div className={`event-detail ${getEvent(selectedDate).type}`}>
              <span className="event-icon">
                {getEvent(selectedDate).type === 'deadline' && '⏰'}
                {getEvent(selectedDate).type === 'event' && '🎉'}
                {getEvent(selectedDate).type === 'reminder' && '🔔'}
              </span>
              <span>{getEvent(selectedDate).title}</span>
            </div>
          ) : (
            <p className="no-events">No events scheduled</p>
          )}
        </div>
      )}

      {/* Upcoming Events */}
      <div className="upcoming-events">
        <h4>📌 Upcoming Events</h4>
        {events.slice(0, 3).map((event, index) => (
          <div key={index} className={`event-item ${event.type}`}>
            <span className="event-date">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span className="event-title">{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
