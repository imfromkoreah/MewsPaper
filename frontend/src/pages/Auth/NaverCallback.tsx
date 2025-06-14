// src/pages/Auth/NaverCallback.tsx

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NaverCallback() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    const parentOrigin = import.meta.env.VITE_FRONTEND_ORIGIN;

    console.log("--- NaverCallback.tsx 로드 시작 ---");
    console.log("현재 팝업 URL:", window.location.href);
    console.log("수신된 code:", code ? code.substring(0, 10) + '...' : '없음');
    console.log("수신된 state:", state ? state.substring(0, 10) + '...' : '없음');
    console.log("부모 창 Origin (VITE_FRONTEND_ORIGIN):", parentOrigin);
    console.log("window.opener 객체 존재 여부:", !!window.opener);
    // --- 디버깅 로그 끝 ---

    if (!parentOrigin) {
        console.error("오류: VITE_FRONTEND_ORIGIN 환경 변수가 설정되지 않았습니다.");
        if (window.opener) {
            window.opener.postMessage({ type: 'NAVER_LOGIN_FAILURE_FROM_POPUP', error: 'FRONTEND_ORIGIN_NOT_SET' }, '*');
            window.close();
        }
        return;
    }

    if (window.opener) {
      console.log("window.opener 감지됨. 부모 창으로 메시지 전송 시도...");
      if (code && state) {
        try {
            window.opener.postMessage({ type: 'NAVER_AUTH_CODE', code, state }, parentOrigin);
            console.log(`성공: NAVER_AUTH_CODE 메시지 전송 완료. TargetOrigin: ${parentOrigin}`);
        } catch (e) {
            console.error("오류: window.opener.postMessage 실패:", e);
            window.opener.postMessage({ type: 'NAVER_LOGIN_FAILURE_FROM_POPUP', error: 'POST_MESSAGE_FAILED', details: (e as Error).message }, '*'); // 'e'를 'Error' 타입으로 캐스팅
        }
      } else {
        console.error("오류: Naver 콜백에 필요한 'code' 또는 'state'가 없습니다.");
        window.opener.postMessage({ type: 'NAVER_LOGIN_FAILURE_FROM_POPUP', error: 'AUTH_DATA_MISSING', currentUrl: window.location.href }, parentOrigin);
      }
      window.close();
      console.log("팝업 창 닫기 요청됨.");
    } else {
      console.warn('경고: 이 페이지는 Naver 로그인 팝업으로만 접근해야 합니다.');
      document.body.innerHTML = '<div><h1>잘못된 접근입니다.</h1><p>정상적인 경로로 다시 로그인 해주세요.</p></div>';
    }
    console.log("--- NaverCallback.tsx 종료 ---");
  }, [location]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>
      <p>Naver 로그인 처리 중...</p>
    </div>
  );
}