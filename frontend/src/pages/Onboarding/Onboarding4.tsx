// src/pages/Onboarding4.tsx
import React, { useState, useEffect } from "react"; // useEffect 임포트 추가

// Onboarding 컴포넌트로부터 받을 props 정의
interface Onboarding4Props {
    onPreferencesUpdate: (selectedKeys: string[]) => void;
    initialSelectedPreferences: string[]; // 부모로부터 초기 선택 값을 받을 prop
}

// 백엔드 preference_key에 매핑될 값으로 id를 정의합니다.
// 예: "politics" -> 백엔드에서 "POLITICS"로 변환하거나,
// 애초에 여기서 "POLITICS"로 정의하고 백엔드와 맞추는 것이 좋습니다.
// 여기서는 일단 백엔드에서 사용할 값으로 `id`를 정의합니다.
const interests = [
    { id: "POLITICS", label: "정치", icon: "🏛️" },
    { id: "ECONOMY", label: "경제", icon: "💰" },
    { id: "SOCIETY", label: "사회", icon: "🏙️️" },
    { id: "LIFESTYLE_CULTURE", label: "생활/문화", icon: "🎨" }, // 백엔드와 일치하도록 변경
    { id: "IT_SCIENCE", label: "IT/과학", icon: "💻" },           // 백엔드와 일치하도록 변경
    { id: "WORLD", label: "세계", icon: "🌍" },
    { id: "RANKING", label: "랭킹", icon: "🏆" },
    { id: "TREND", label: "트렌드", icon: "🗣" },
];

// Onboarding4 컴포넌트 정의 (props를 받도록 수정)
export default function Onboarding4({ onPreferencesUpdate, initialSelectedPreferences }: Onboarding4Props) {
    // 부모로부터 받은 initialSelectedPreferences를 초기값으로 설정
    const [selected, setSelected] = useState<string[]>(initialSelectedPreferences);

    // 선택 상태가 변경될 때마다 부모 컴포넌트의 콜백 호출
    useEffect(() => {
        onPreferencesUpdate(selected);
    }, [selected, onPreferencesUpdate]);

    const toggleInterest = (id: string) => {
        setSelected((prev) => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter((i) => i !== id);
            } else if (prev.length < 3) {
                return [...prev, id];
            } else {
                return prev; // 3개 이상 선택 못하도록 제한
            }
        });
    };

    return (
        <div className="w-[375px] mx-auto px-6 py-4 mt-12 text-left h-auto flex flex-col items-start">
            {/* 상단 텍스트 영역 */}
            <div className="mb-6">
                <h2 className="font-['Inter'] text-[22px] font-bold leading-9 text-[#090a0a]">
                    마지막으로,
                    <br />
                    관심사를 선택해 주세요
                </h2>
                <p className="text-sm text-[#090a0a] mt-1">
                    관심사에 맞는 뉴스레터를 추천해 줄게요!
                </p>
            </div>

            {/* 관심사 버튼 그룹 */}
            <div className="self-center grid grid-cols-2 gap-x-4 gap-y-4">
                {interests.map(({ id, label, icon }) => {
                    const isSelected = selected.includes(id);
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => toggleInterest(id)}
                            className={`
                                w-[130px] h-[69px] rounded-[7px] border
                                shadow-[0px_10px_10px_0px_rgba(0,0,0,0.05)]
                                border-[#cacaca]/30
                                flex flex-col items-center justify-center
                                cursor-pointer
                                ${isSelected ? "bg-[#4f46e5] border-[#4f46e5]" : "bg-white"}
                            `}
                            aria-pressed={isSelected}
                        >
                            <span
                                className={`text-[15px] ${
                                    isSelected ? "text-white" : "text-black"
                                }`}
                            >
                                {icon}
                            </span>
                            <span
                                className={`text-sm font-normal leading-none mt-1 ${
                                    isSelected ? "text-white" : "text-black"
                                }`}
                            >
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 하단 안내 문구 */}
            <p className="text-xs text-[#6c7072] mt-6 self-center">
                나중에 설정에서 변경할 수 있어요!
            </p>
        </div>
    );
}