import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일 유효성 체크
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // 로그인 버튼 활성화 조건
  const canSubmit = isValidEmail(email) && password.length >= 8;

  // 로그인 버튼 클릭 시 처리 함수
  const handleSubmit = () => {
    alert(`로그인 시도: ${email}`);
    navigate('/home');
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
                canSubmit ? 'bg-[#6B4EFF]' : 'bg-[#d2d5d6]'
              }`}
              disabled={!canSubmit}
            >
              로그인
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
