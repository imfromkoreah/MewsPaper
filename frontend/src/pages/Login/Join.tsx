import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckOn from '../../assets/svg/check_on.svg';
import CheckOff from '../../assets/svg/check_off.svg';

export default function Join() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

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

  const handleSubmit = () => {
    // 회원가입 로직 처리 가능
    alert(`회원가입 시도: ${email}`);
    navigate('/login');
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
                  canSubmit ? 'bg-[#6B4EFF]' : 'bg-[#d2d5d6]'
                }`}
                disabled={!canSubmit}
              >
                회원가입
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
