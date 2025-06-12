import React from 'react';
import Calendar from '../components/Calendar';
import PawIcon from '../assets/svg/jelly_on.svg';

interface AttendanceCalendarProps {
  attendanceDates: string[];
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ attendanceDates }) => {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

  const isAttended = (date: Date) => attendanceDates.includes(formatDate(date));

  // 클릭 이벤트 비활성화용 빈 함수
  const handleDateClick = (date: Date) => {};

  const renderDateCell = (date: Date, isCurrentMonth: boolean) => (
    <span
      style={{
        position: 'relative',
        backgroundColor: isAttended(date) && isCurrentMonth ? 'rgba(32, 155, 28, 0.3)' : undefined,
        color: isAttended(date) && isCurrentMonth ? '#fff' : undefined,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        lineHeight: '30px',
        textAlign: 'center',
        borderRadius: '50%',
        userSelect: 'none',
        fontWeight: 500,
        fontSize: 14,
        boxSizing: 'border-box',
      }}
    >
      {date.getDate()}
      {isAttended(date) && isCurrentMonth && (
        <img
          src={PawIcon}
          alt="paw stamp"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </span>
  );

  return <Calendar renderDateCell={renderDateCell} onDateClick={handleDateClick} />;
};

export default AttendanceCalendar;
