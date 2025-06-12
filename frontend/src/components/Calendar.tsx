import React, { useState } from 'react';
import styled from 'styled-components';

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const DateDisplay = styled.span`
  font-size: 20px;
  font-weight: bold;
  margin-left: 12px;
  color: rgba(60, 60, 67, 0.8);
`;

const NavButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    color: rgba(60, 60, 67, 0.8);

    &:hover {
      background-color: #ddd;
    }
  }
`;

const DatesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CalendarWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  font-family: 'Pretendard', sans-serif;
  background-color: rgb(252, 252, 252);
  padding: 16px;
  border-radius: 0 0 10px 10px; /* 좌우하단만 */
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: rgba(60, 60, 67, 0.6);
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DateCell = styled.div<{ $dimmed?: boolean }>`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: ${({ $dimmed }) => ($dimmed ? '#ccc' : '#000')};

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${({ $dimmed }) =>
      $dimmed ? 'transparent' : 'rgba(107, 78, 255, 0.3)'};
    color: ${({ $dimmed }) => ($dimmed ? '#ccc' : '#fff')};
    font-weight: 500;
  }
`;

interface CalendarProps {
  renderDateCell?: (date: Date, isCurrentMonth: boolean) => React.ReactNode;
  onDateClick?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ renderDateCell, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  const groupDatesByWeek = (start: Date, end: Date) => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    let date = new Date(start);

    while (date <= end) {
      currentWeek.push(new Date(date));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      date.setDate(date.getDate() + 1);
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  const weeks = groupDatesByWeek(startDay, endDay);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSameMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <DateDisplay>
          {year}년 {month + 1}월
        </DateDisplay>
        <NavButtons>
          <button onClick={handlePrevMonth}>❮</button>
          <button onClick={handleNextMonth}>❯</button>
        </NavButtons>
      </CalendarHeader>

      <WeekDays>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </WeekDays>

      <DatesGrid>
        {weeks.map((week, i) => (
          <WeekRow key={i}>
            {week.map((date, j) => {
              const currentMonth = isSameMonth(date);
              return (
                <DateCell key={j} $dimmed={!currentMonth} onClick={() => onDateClick?.(date)}>
                  {renderDateCell
                    ? renderDateCell(date, currentMonth)
                    : <span>{date.getDate()}</span>}
                </DateCell>
              );
            })}
          </WeekRow>
        ))}
      </DatesGrid>
    </CalendarWrapper>
  );
};

export default Calendar;
