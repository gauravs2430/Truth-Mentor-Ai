import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  );
}
