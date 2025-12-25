'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, GraduationCap, MessageSquare, BarChart3, Clock, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setRole(parsed);
        } catch (err) {
          console.error('Failed to parse user from localStorage:', err);
        }
      }
    }
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/' },
    { icon: MessageSquare, label: 'Scenario', link: '/scenario' },
    { icon: BarChart3, label: 'Results & Evaluations', link: '/results' },
    { icon: Clock, label: 'History', link: '/history' },
    { icon: Clock, label: 'Evaluation', link: '/evaluation' },
    { icon: Clock, label: 'Users', link: '/users', role: 'admin' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.role && item.role !== role.role) return false;
    return true;
  });

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {role?.userName
                ? role.userName.split(' ').map(word => word.slice(0, 1)).join('')
                : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 fixed lg:relative z-50
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Desktop Header */}
        <div className="p-4 border-b border-gray-200 hidden lg:flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-gray-900">AI Roleplay Trainer</h1>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto mt-16 lg:mt-0 relative">
          <ul className="space-y-2">
            {filteredMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              return (
                <li key={index}>
                  <Link
                    href={item.link}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                      ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout button for mobile only at bottom */}
          {isMobileMenuOpen && (
            <button
              onClick={handleLogout}
              className="absolute bottom-4 left-4 right-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          )}
        </nav>

        {/* User Profile - Desktop */}
        {!isCollapsed && (
          <div className="hidden lg:flex flex-col p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {role?.userName
                    ? role.userName.split(' ').map(word => word.slice(0, 1)).join('')
                    : ''}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{role.userName}</h3>
                <p className="text-xs text-gray-500">Trainee</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* Collapsed User Icon */}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-200 flex justify-center lg:justify-start mt-auto">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">ED</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
