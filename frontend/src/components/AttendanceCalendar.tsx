import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import PawIcon from '../assets/svg/jelly_on.svg';  // SVG 경로 확인하고 맞게 수정하세요

const AttendanceCalendar = () => {
  const [attendanceDates, setAttendanceDates] = useState<string[]>([
    '2025-06-06',
    '2025-06-02',
    '2025-06-12'
  ]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });

  const isAttended = (date: Date) => attendanceDates.includes(formatDate(date));

  // 클릭 이벤트를 비활성화하려 onDateClick에 빈 함수 할당
  const handleDateClick = (date: Date) => {
    // 클릭해도 아무 동작 안함
  };

  const renderDateCell = (date: Date, isCurrentMonth: boolean) => (
    <span
      style={{
        position: 'relative', // 아이콘 절대 위치 위한 부모 위치 설정
        backgroundColor: isAttended(date) && isCurrentMonth ? 'rgba(32, 155, 28, 0.3)' : undefined,
        color: isAttended(date) && isCurrentMonth ? '#fff' : undefined,
        display: 'inline-flex',    // inline-block -> inline-flex로 변경 (가로세로 중앙정렬 용이)
        justifyContent: 'center',  // 가로 중앙 정렬
        alignItems: 'center',      // 세로 중앙 정렬
        width: 30,                 // 보라색 원 크기 30px로 변경
        height: 30,
        lineHeight: '30px',        // lineHeight도 30px로 변경 (숫자 텍스트 정렬 보조)
        textAlign: 'center',
        borderRadius: '50%',
        userSelect: 'none',
        fontWeight: 500,           // 숫자 굵기 조금 더 명확하게
        fontSize: 14,              // 적당한 숫자 크기 (필요시 조정)
        boxSizing: 'border-box',  // 크기 관련 안정성
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

  return (
    <Calendar
      renderDateCell={renderDateCell}
      onDateClick={handleDateClick}  // 클릭 무시용 빈 함수
    />
  );
};

export default AttendanceCalendar;
