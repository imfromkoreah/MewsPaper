// 로딩 애니메이션 컴포넌트
function LoadingDots() {
  return (
    <div className="flex justify-center items-center h-full gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

export default LoadingDots;
