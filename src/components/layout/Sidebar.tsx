import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, Image, Flag, Bell, ChevronDown, ChevronRight,
  LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { adminNavigation } from '@/configs/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  Users: <Users size={18} />,
  Image: <Image size={18} />,
  Flag: <Flag size={18} />,
  Bell: <Bell size={18} />,
};

export function Sidebar() {
  const { logout, adminInfo } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const [openGroups, setOpenGroups] = useState<string[]>(['회원', '피드', '공지·FAQ']);
  const { location } = useRouterState();

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  }

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-900 text-gray-100 transition-all duration-200 shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 h-14">
        {!sidebarCollapsed && <span className="font-bold text-white text-lg">SNS Admin</span>}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {adminNavigation.map((item) => {
          if (item.path) {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors',
                  active && 'bg-primary-600 text-white',
                  sidebarCollapsed && 'justify-center',
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {iconMap[item.icon]}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          }

          const isOpen = openGroups.includes(item.label);
          return (
            <div key={item.label}>
              <button
                onClick={() => !sidebarCollapsed && toggleGroup(item.label)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors',
                  sidebarCollapsed && 'justify-center',
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {iconMap[item.icon]}
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </>
                )}
              </button>
              {!sidebarCollapsed && isOpen && item.children?.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={cn(
                    'flex items-center pl-11 pr-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors',
                    isActive(child.path) && 'bg-primary-600 text-white',
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        {!sidebarCollapsed && adminInfo && (
          <div className="text-xs text-gray-400 mb-3 truncate">{adminInfo.name}</div>
        )}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors',
            sidebarCollapsed && 'justify-center',
          )}
          title="로그아웃"
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}
