'use client';

import React, { useState } from 'react';
import { Layers, PlusCircle } from 'lucide-react';
import InnerNavbar from '../../../components/navbar.jsx';
import AllPlans from './allPlans/AllPlans.jsx';
import AddPlans from './add/AddPlans.jsx';

export default function PlanPage() {
  const [currentView, setCurrentView] = useState('All Plans');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tight">
          Subscription Plans
        </h1>
        <p className="text-gray-400 text-sm font-bold mt-1">
          Manage your subscription tiers and pricing
        </p>
      </div>

      {/* شريط التنقل للتبديل بين الصفحات */}
      <InnerNavbar 
        activeTabLabel={currentView}
        onTabChange={(label) => setCurrentView(label)} 
        items={[
          { icon: Layers, label: 'All Plans' },
          { icon: PlusCircle, label: 'Add Plan' }
        ]}
      />

      {/* حاوية المحتوى */}
      <div className="mt-8 bg-white p-4 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[500px]">
        {currentView === 'All Plans' ? (
          <AllPlans />
        ) : (
          <AddPlans />
        )}
      </div>
      
    </div>
  );
}