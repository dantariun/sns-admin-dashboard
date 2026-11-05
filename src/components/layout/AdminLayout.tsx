import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui/Toast/ToastContainer';

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
