'use client';
import React from 'react';
import { Loader2, ShieldCheck, Activity, Database } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Container الرئيسي مع أنيميشن خفيف */}
      <div className="relative flex flex-col items-center max-w-sm w-full">
        
        {/* اللوجو أو الأيقونة المركزية مع نبض (Pulse) */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25"></div>
          <div className="relative bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin stroke-[3px]" />
          </div>
        </div>

        {/* نصوص التحميل */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
            Syncing Analytics
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
            Fetching Team Performance...
          </p>
        </div>

        {/* شريط التقدم الوهمي السفلي */}
        <div className="w-full mt-10 space-y-4">
          <div className="flex justify-between items-end px-2">
            <div className="flex gap-2 items-center">
               <Activity size={14} className="text-blue-500" />
               <span className="text-[10px] font-black text-gray-400 uppercase">Processing Pipeline</span>
            </div>
            <span className="text-[10px] font-black text-blue-600">85%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-[loading_2s_ease-in-out_infinite] w-[60%]"></div>
          </div>
        </div>

        {/* أيقونات توضح جودة البيانات (تعطي طابع احترافي) */}
        <div className="flex gap-6 mt-12 opacity-40">
           <div className="flex items-center gap-1.5">
             <ShieldCheck size={14} className="text-gray-500" />
             <span className="text-[9px] font-bold uppercase">Encrypted</span>
           </div>
           <div className="flex items-center gap-1.5">
             <Database size={14} className="text-gray-500" />
             <span className="text-[9px] font-bold uppercase">Real-time DB</span>
           </div>
        </div>
      </div>

      {/* إضافة الأنيماشين المخصص لشريط التحميل في Tailwind config أو كـ Style tag */}
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}