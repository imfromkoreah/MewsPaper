// 메시지 흐름 관리 훅 (메시지 표시 순서 제어, showMessages 등)
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  delay: number;
}

interface UserInfo {
  nickname: string;
}

export function useChatFlow() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ nickname: '' });
  const [botMessages, setBotMessages] = useState<Message[]>([]);

  useEffect(() => {
    const showMessages = async (msgs: Message[]) => {
      for (let i = 0; i < msgs.length; i++) {
        setActiveIndex(i);
        await new Promise((r) => setTimeout(r, msgs[i].delay));
        setVisibleMessages((prev) => [...prev, msgs[i].id]);
      }
      setInputVisible(true);
    };

    const userId = localStorage.getItem('userId');

    const createMessages = (nickname: string = ''): Message[] => [
      { id: 1, text: `안냥🐱~ 나는 너만의 앵커 ${nickname}이야!`, delay: 500 },
      { id: 2, text: '보고 싶은 키워드를 입력하면 관련된 뉴스를 요약해서 보여줄 거야', delay: 1000 },
      { id: 3, text: '궁금한 뉴스가 있다면...', delay: 1000 },
      { id: 4, text: '나에게 말을 걸어줘!', delay: 1000 },
    ];

    if (userId) {
      axios
        .get(`http://localhost:8080/api/user/${userId}`)
        .then((res) => {
          setUserInfo(res.data);
          const messages = createMessages(res.data.nickname);
          setBotMessages(messages);
          showMessages(messages);
        })
        .catch(() => {
          const fallback = createMessages();
          setBotMessages(fallback);
          showMessages(fallback);
        });
    } else {
      const fallback = createMessages();
      setBotMessages(fallback);
      showMessages(fallback);
    }
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setUserMessages((prev) => [...prev, inputText.trim()]);
    setInputText('');
  };

  return {
    visibleMessages,
    activeIndex,
    inputVisible,
    inputText,
    setInputText,
    handleSend,
    userMessages,
    userInfo,
    botMessages,
  };
}
