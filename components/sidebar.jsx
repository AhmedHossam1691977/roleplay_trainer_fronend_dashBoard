'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, GraduationCap, MessageSquare, BarChart3, Clock, LogOut, Menu, X, Users, NotebookTabs } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (err) {
          console.error('Failed to parse user:', err);
        }
      }
    }
    return { userName: '', role: '' };
  });

  // مصفوفة القائمة
  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/' },
    { icon: MessageSquare, label: 'Scenarios', link: '/scenario' },
    { icon: BarChart3, label: 'Results & Analytics', link: '/results', role: ['admin', "user"] },
    { icon: Clock, label: 'History', link: '/history', role: ['user', 'super-admin']},
    { icon: GraduationCap, label: 'Evaluation', link: '/evaluation', role: ['admin', 'super-admin']},
    { icon: Users, label: 'User Management', link: '/users', role: ['admin', 'super-admin'] },
    { icon: NotebookTabs, label: 'Session Management', link: '/session', role: ['admin', 'super-admin'] },
    { icon: NotebookTabs, label: 'Plans Management', link: '/plans', role: ['super-admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true;
    return item.role.includes(user.role);
  });

  // التحقق هل المستخدم مسموح له رؤية Plans (أي شخص غير الـ user)
  const canSeePlans = user.role !== 'user';

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    window.location.href = "/login";
  };

  const getUserInitials = () => {
    if (!user?.userName) return 'AI';
    return user.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile Fixed Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[60] h-16 flex items-center justify-between px-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-2 font-bold text-blue-600">
          <GraduationCap size={24} />
          <span className="text-sm">Roleplay AI</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
          >
            {getUserInitials()}
          </button>

          {isUserDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150 origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-900 truncate">{user.userName || 'Guest'}</p>
                  <p className="text-[10px] text-gray-400 uppercase">{user.role || 'User'}</p>
                </div>

                {/* تظهر فقط إذا لم يكن user */}
                {canSeePlans && (
                  <Link
                    href="/plans"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-colors uppercase tracking-wider ${
                      pathname === '/plans' ? 'bg-red-50 text-red-600' : 'text-red-500 hover:bg-red-50'
                    }`}
                  >
                    Plans
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-600 font-bold hover:bg-gray-50 transition-colors border-t border-gray-50 uppercase"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 fixed top-0 left-0 z-[58]
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section - Desktop */}
        <div className="p-4 h-16 border-b border-gray-100 hidden lg:flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-gray-900 truncate leading-tight">AI Trainer</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Roleplay Platform</p>
            </div>
          )}
          {/* Plans تظهر في الديسكتوب فقط لمن ليس user */}
          {!isCollapsed && canSeePlans && (
             <Link
             href="/plans"
             className={`text-[10px] font-bold underline underline-offset-2 tracking-wider uppercase ml-auto transition-colors ${
                pathname === '/plans' ? 'text-blue-600' : 'text-red-500 hover:text-red-600'
             }`}
           >
             Plans
           </Link>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-16 lg:mt-0 pt-4">
          {filteredMenuItems.map((item, index) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={index}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer (Desktop) */}
        <div className="hidden lg:block p-4 border-t border-gray-100 bg-gray-50/50">
          {!isCollapsed && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {getUserInitials()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate tracking-tight">{user.userName || 'Guest User'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{user.role || 'Trainee'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold uppercase"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
          {isCollapsed && (
            <button onClick={handleLogout} className="w-full flex justify-center text-red-500 hover:bg-red-50 p-2 rounded-lg">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  );
}