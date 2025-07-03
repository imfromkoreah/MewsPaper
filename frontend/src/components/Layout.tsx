import TopNav from './TopNav';
import BottomNav from './BottomNav';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-md border border-gray-200 rounded shadow-sm bg-white min-h-screen relative">
        
        {/* TopNav 고정 */}
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md  border-gray-200 bg-white z-30">
          <TopNav />
        </div>
        
        {/* main 콘텐츠는 TopNav 아래, BottomNav 위에 위치하게 */}
        <main className="pt-[56px] pb-[56px] flex-1 overflow-y-auto">
          {children}
        </main>

        
        {/* BottomNav 고정 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md  border-gray-200 bg-white z-30">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
