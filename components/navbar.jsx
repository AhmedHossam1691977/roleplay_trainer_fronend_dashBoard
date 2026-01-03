'use client';
import React, { useState, useEffect } from 'react';

export default function InnerNavbar({ items = [], onTabChange, activeTabLabel }) {

  const [user, setUser] = useState({ userName: '', role: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      console.log(storedUser);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Failed to parse user:', err);
        }
      }
    }
  }, []);


  const filteredItems = items.filter((item) => {
    console.log(items);
    
    if (!item.role) return true;
    return item.role.includes(user.role);
  });

  return (
    <div className="w-full mb-8 relative">
      <nav className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl w-fit border border-gray-200">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTabLabel === item.label;

          return (
            <button
              key={item.label}
              onClick={() => onTabChange(item.label)}
              className={`
                relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? 'bg-white text-blue-600 shadow-md shadow-blue-100/50 ring-1 ring-gray-200/50 scale-105' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                }
              `}
            >
              {Icon && (
                <Icon 
                  size={18} 
                  className={`${isActive ? 'text-blue-600' : 'text-gray-400'}`} 
                />
              )}
              <span>{item.label}</span>
              
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}