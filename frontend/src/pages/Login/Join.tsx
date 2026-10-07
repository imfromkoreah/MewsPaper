import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckOn from '../../assets/svg/check_on.svg';
import CheckOff from '../../assets/svg/check_off.svg';

export default function Join() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태
  const [error, setError] = useState<string | null>(null); // API 호출 에러 메시지


  // 이메일 유효성 체크 (Login과 동일)
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // 비밀번호 유효성 체크: 영문, 숫자, 특수문자 포함 8자 이상
  const isValidPassword = (pw: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/.test(pw);
  };

  // 비밀번호 확인 일치 여부
  const isMatch = password && confirmPw && password === confirmPw;

  // 제출 가능 조건: 이메일, 비밀번호 유효 + 비밀번호 확인 일치
  const canSubmit = isValidEmail(email) && isValidPassword(password) && isMatch;

const handleSubmit = async () => {
    if (!canSubmit) {
      alert('입력된 정보를 다시 확인해주세요.');
      return;
    }

    setLoading(true); // 로딩 시작
    setError(null);   // 이전 에러 초기화

    try {
      const response = await fetch('http://localhost:8080/api/auth/email', { // ⭐ 이 URL을 백엔드 회원가입 API에 맞춰주세요
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // 성공적으로 회원가입
        alert('회원가입이 완료되었습니다. 로그인 해주세요!');
        console.log('회원가입 성공:', await response.json());
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        // 회원가입 실패 (예: 이미 존재하는 이메일)
        const errorData = await response.json();
        const errorMessage = errorData.message || '회원가입에 실패했습니다.';
        setError(errorMessage);
        alert(`회원가입 실패: ${errorMessage}`);
        console.error('회원가입 실패:', errorData);
      }
    } catch (err) {
      // 네트워크 오류 등 예외 발생
      console.error('회원가입 중 오류 발생:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
      alert('서버 오류: 회원가입에 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };


  return (
    <div className="max-w-md mx-auto h-screen flex flex-col justify-center items-center px-6 py-10 border border-gray-200 rounded shadow-sm">
      <div className="w-[375px] h-[812px] relative bg-white rounded-[32px] overflow-hidden p-6 flex flex-col justify-between mt-2">
        <div className="flex flex-col gap-6">
          <h2 className="text-black text-2xl font-bold leading- mt-12">
            이메일과 비밀번호를<br />입력해주세요.
          </h2>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#828a8f] text-sm">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sample@gmail.com"
                className={`h-12 px-4 border rounded-lg text-[15px] text-[#1e1e1e] placeholder-[#9d9d9d] ${
                  email && !isValidEmail(email) ? 'border-red-500' : 'border-[#e8e9eb]'
                }`}
              />
              {email && !isValidEmail(email) && (
                <p className="text-red-500 text-xs mt-1">유효한 이메일 형식이 아닙니다.</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#828a8f] text-sm">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                className={`h-12 px-4 border rounded-lg text-base placeholder-[#9c9c9c] ${
                  password && !isValidPassword(password) ? 'border-red-500' : 'border-[#e8e9eb]'
                }`}
              />
              {password && !isValidPassword(password) && (
                <p className="text-red-500 text-xs mt-1">
                  영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[#828a8f] text-sm">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="비밀번호 재입력"
                className={`h-12 px-4 pr-10 border rounded-lg text-base placeholder-[#9c9c9c] w-[280px] ${
                  confirmPw && !isMatch ? 'border-red-500' : 'border-[#e8e9eb]'
                }`}
              />
              <img
                src={isMatch && confirmPw ? CheckOn : CheckOff}
                alt="비밀번호 일치 여부 아이콘"
                className="absolute right-3 top-12 transform -translate-y-1/2 w-5 h-5"
              />
              {confirmPw && !isMatch && (
                <p className="text-red-500 text-xs mt-1 absolute top-[62px] left-0">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            <div className="pt-6">
              <button
                onClick={handleSubmit}
                className={`w-full h-[50px] rounded-lg text-white font-semibold text-base ${
                  canSubmit && !loading ? 'bg-[#6B4EFF]' : 'bg-[#d2d5d6] cursor-not-allowed'
                }`}
                disabled={!canSubmit || loading} // 로딩 중에는 버튼 비활성화
              >
                {loading ? '회원가입 중...' : '회원가입'}
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              이미 계정이 있나요?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-gray-500 cursor-pointer hover:underline"
              >
                로그인
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
