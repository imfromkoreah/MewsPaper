// frontend/src/auth/GoogleCallback.tsx

import React, { useEffect } from 'react';

const GoogleCallback: React.FC = () => {
  useEffect(() => {
    console.log('GoogleCallback 컴포넌트 렌더링 및 useEffect 실행됨.');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log('GoogleCallback - code:', code);
    console.log('GoogleCallback - state:', state);
    console.log('GoogleCallback - error:', error);

    if (window.opener) {
      console.log('GoogleCallback - window.opener 존재함.');
      if (code && state) {
        console.log('GoogleCallback - code와 state 존재, postMessage 시도.');
        // 부모 창으로 메시지 전송
        window.opener.postMessage({ type: 'GOOGLE_AUTH_CODE', code, state }, window.location.origin);
        
        // ⭐ 추가: 메시지 전송 후 현재 팝업 창 닫기
        window.close(); // <--- 이 부분이 핵심입니다!
      } else if (error) {
        console.log('GoogleCallback - 에러 발생, postMessage 시도:', error);
        // 오류 메시지 전송
        window.opener.postMessage({ type: 'GOOGLE_LOGIN_FAILURE_FROM_POPUP', error }, window.location.origin);
        
        // ⭐ 추가: 오류 발생 시에도 팝업 창 닫기 (선택 사항이지만 일반적으로 오류 시에도 닫는 것이 사용자 경험에 좋음)
        window.close(); // <--- 이 부분도 추가합니다.
      } else {
        console.log('GoogleCallback - code, state, error 없음. 비정상적인 콜백.');
        // ⭐ 추가: 비정상적인 경우에도 팝업 창 닫기 (선택 사항)
        // window.opener.postMessage({ type: 'GOOGLE_LOGIN_FAILURE_FROM_POPUP', error: 'No code or error received' }, window.location.origin);
        window.close(); // <--- 이 부분도 추가합니다.
      }
    } else {
      console.warn('GoogleCallback 페이지가 팝업이 아닌 메인 창에서 직접 접근되었습니다.');
      // 팝업이 아닐 경우 바로 닫지 않거나, 특정 페이지로 리다이렉션
      // navigate('/splash'); // 또는 window.location.href = '/';
      // ⭐ (선택 사항) 팝업이 아닌데 이 페이지가 열렸을 경우, 사용자에게 메시지를 보여준 후 자동으로 닫거나 메인 페이지로 리디렉션
      // 예시: setTimeout(() => window.location.href = '/', 3000);
    }
  }, []); // 의존성 배열을 비워 useEffect가 한 번만 실행되도록 유지

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', backgroundColor: '#f0f0f0' }}>
      <h2>Google 로그인 처리 중입니다... 잠시 기다려주세요.</h2>
      <p>이 창은 잠시 후 자동으로 닫힙니다.</p>
    </div>
  );
};

export default GoogleCallback;