import TopNav from './TopNav';
import BottomNav from './BottomNav';
import type { ReactNode } from 'react';


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full flex flex-col border border-gray-200 rounded shadow-sm bg-white">
        <TopNav />

        <main className="flex-grow overflow-y-auto pt-4 pb-16 px-6">
          {children}
        </main>

        <BottomNav />
      </div>
    </div>
  );
} 
