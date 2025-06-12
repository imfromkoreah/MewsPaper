import React, { useState } from 'react';
import Calendar from '../components/Calendar';


const AttendanceCalendar = () => {
  const [attendanceDates, setAttendanceDates] = useState<string[]>([
    '2025-06-06',
    '2025-06-02',
    '2025-06-12'
  ]);
  

  const formatDate = (date: Date) =>
    date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

  const isAttended = (date: Date) => attendanceDates.includes(formatDate(date));

  const handleDateClick = (date: Date) => {
    const formatted = formatDate(date);
    if (!attendanceDates.includes(formatted)) {
      setAttendanceDates([...attendanceDates, formatted]);
    }
  };

  const renderDateCell = (date: Date, isCurrentMonth: boolean) => (
    <span
      style={{
        backgroundColor: isAttended(date) && isCurrentMonth ? 'rgba(32, 155, 28, 0.3)' : undefined,
        color: isAttended(date) && isCurrentMonth ? '#fff' : undefined,
      }}
    >
      {date.getDate()}
    </span>
  );

  return (
    <Calendar
      renderDateCell={renderDateCell}
      onDateClick={handleDateClick}
    />
  );
};

export default AttendanceCalendar;
