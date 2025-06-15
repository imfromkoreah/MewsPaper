import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로그인 로딩 상태
  const [error, setError] = useState<string | null>(null); // 로그인 에러 메시지

  // 이메일 유효성 체크
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // 로그인 버튼 활성화 조건
  const canSubmit = isValidEmail(email) && password.length >= 8;

  // 로그인 버튼 클릭 시 처리 함수
  const handleSubmit = async () => {
    // 유효성 검사 통과 여부 확인
    if (!canSubmit) {
      setError('이메일 또는 비밀번호 형식이 올바르지 않습니다.');
      return;
    }

    setLoading(true); // 로그인 시도 시 로딩 상태 활성화
    setError(null);   // 이전 에러 메시지 초기화

    try {
      // ⭐ 백엔드 로그인 API 엔드포인트로 요청을 보냅니다.
      // 이 URL은 실제 백엔드 API 명세에 따라 변경해야 합니다.
      const response = await fetch('http://localhost:8080/api/auth/login', { // 백엔드 로그인 API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // ⭐ 로그인 성공 처리
        const data = await response.json();
        console.log('로그인 성공:', data);
        if (data.user.id) {
            localStorage.setItem('userId', data.user.id); // localStorage에 사용자 ID 저장
        }
        alert('로그인에 성공했습니다!');

        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // 전체 페이지 리로드
        } else {
            navigate('/home'); // 기본 홈 페이지로 이동
        }

      } else {
        // ⭐ 로그인 실패 처리
        const errorData = await response.json();
        const errorMessage = errorData.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
        setError(errorMessage);
        console.error('로그인 실패:', errorData);
        alert(`로그인 실패: ${errorMessage}`);
      }
    } catch (err) {
      // ⭐ 네트워크 오류 등 예외 처리
      console.error('로그인 중 네트워크 오류 발생:', err);
      setError('서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.');
      alert('서버 오류: 로그인에 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 회원가입 페이지로 이동 함수
  const goToJoin = () => {
    navigate('/join');
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-center items-center px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="w-[375px] h-[812px] relative bg-white rounded-[32px] overflow-hidden p-6 flex flex-col justify-between mt-2">
        <div className="flex flex-col gap-6 mt-16">
          <div className="flex flex-col gap-2">
            <label className="text-[#828a8f] text-sm">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sample@gmail.com"
              className="h-12 px-4 border border-[#e8e9eb] rounded-lg text-[15px] text-[#1e1e1e] placeholder-[#9d9d9d]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#828a8f] text-sm">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              className="h-12 px-4 border border-[#e8e9eb] rounded-lg text-base placeholder-[#9c9c9c]"
            />
          </div>

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className={`w-full h-[50px] rounded-lg text-white font-semibold text-base ${
                canSubmit && !loading ? 'bg-[#6B4EFF]' : 'bg-[#d2d5d6] cursor-not-allowed'
              }`}
              disabled={!canSubmit || loading} // 로딩 중에도 버튼 비활성화
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            계속 진행함으로써, 귀하는 저희의{' '}
            <span className="text-[#6B4EFF]">서비스 이용약관</span> 및{' '}
            <span className="text-[#6B4EFF]">개인정보 처리방침</span>에 동의하게 됩니다.
          </p>

          <p
            className="text-center mt-4 text-sm text-gray-500 cursor-pointer select-none"
            onClick={goToJoin}
          >
            계정이 없나요? <span className="underline">회원가입</span>
          </p>
        </div>
      </div>
    </div>
  );
}
