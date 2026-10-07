import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScrapNewsWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  background-color: rgb(252, 252, 252);
  padding: 16px;
  border-radius: 0 0 10px 10px;
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
  min-height: 350px;
  display: flex;
  flex-direction: column;
`;

const CenterMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface NewsItem {
  uniqueLink: string;
  title: string;
  thumbnailUrl?: string;
}

const ScrapNews: React.FC = () => {
  const [scraps, setScraps] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchScraps = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('로그인 정보가 없습니다.');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:8080/api/scrap/list?userId=${userId}`)
      .then(res => setScraps(res.data))
      .catch(err => console.error('스크랩 뉴스 불러오기 실패:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScraps();
    const interval = setInterval(fetchScraps, 5000); // 자동 갱신
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ScrapNewsWrapper><CenterMessage>스크랩 뉴스 불러오는 중...</CenterMessage></ScrapNewsWrapper>;
  }

  if (scraps.length === 0) {
    return <ScrapNewsWrapper><CenterMessage>스크랩한 뉴스가 없습니다.</CenterMessage></ScrapNewsWrapper>;
  }

  // 클릭 시 query param으로 이동
  const handleClick = (uniqueLink: string) => {
    navigate(`/news/detail?link=${encodeURIComponent(uniqueLink)}`);
  };

  return (
    <ScrapNewsWrapper>
      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        {scraps.map(news => (
          <li
            key={news.uniqueLink}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 12, cursor: 'pointer' }}
            onClick={() => handleClick(news.uniqueLink)}
          >
            {news.thumbnailUrl && (
              <img
                src={news.thumbnailUrl}
                alt={news.title}
                style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
              />
            )}
            <span style={{ fontWeight: 'bold', fontSize: 13, color: '#000' }}>{news.title}</span>
          </li>
        ))}
      </ul>
    </ScrapNewsWrapper>
  );
};

export default ScrapNews;
