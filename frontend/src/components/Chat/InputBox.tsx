interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function InputBox({ value, onChange, onSend }: InputBoxProps) {
  const disabled = !value.trim();

  return (
    <div
      className="fixed left-1/2 transform -translate-x-1/2 w-[370px] flex items-center space-x-2"
      style={{ bottom: 70, zIndex: 20 }}
    >
      <div className="flex-1 h-12 bg-[#e3e4e5] rounded-full relative">
        <input
          type="text"
          placeholder="키워드를 입력하라냥!"
          className="w-full h-full px-5 text-base rounded-full bg-white border border-[#e3e4e5] outline-none focus:ring-2 focus:ring-blue-300 transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        type="button"
        className={`w-16 h-12 rounded-full text-white transition-colors ${
          disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500 cursor-pointer'
        }`}
        disabled={disabled}
        onClick={onSend}
      >
        전송
      </button>
    </div>
  );
}
