import React from 'react';
import styled from 'styled-components';

const ScrapNewsWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  background-color: rgb(252, 252, 252);
  padding: 16px;
  border-radius: 0 0 10px 10px; /* 하단 좌우만 둥글게 */
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  min-height: 350px; /* 최소 높이 좀 더 크게 설정 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
`;

const ScrapNews: React.FC = () => {
  return (
    <ScrapNewsWrapper>
      {/* 비어있을 때 보여줄 안내 문구 */}
      스크랩한 뉴스가 없습니다.
    </ScrapNewsWrapper>
  );
  
};

export default ScrapNews;
