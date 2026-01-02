'use client';

import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, CheckCircle2, Users, FileText, X, Loader2, Ban, RotateCcw } from 'lucide-react';
import UpdatePlans from '../update/UpdatePlans.jsx';

export default function AllPlans() {
  const baseUrl = 'https://roleplay-trainer-api.vercel.app';
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [processingId, setProcessingId] = useState(null); 
  
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/plan`);
      const json = await response.json();
      if (json.success) {
        setPlans(json.data);
        
        const alreadyDeleted = json.data.filter(p => p.isDeleted).map(p => p._id);
        setDeletedIds(alreadyDeleted);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleDelete = async (id, currentIsDeleted) => {
    setProcessingId(id);
    try {

      const url = `${baseUrl}/api/v1/plan/${id}`;
      const method = 'DELETE'; 
      
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json', 
          token: localStorage.getItem('token') 
        }
      });

      if (response.ok) {
        if (currentIsDeleted) {
        
          setDeletedIds((prev) => prev.filter((item) => item !== id));
        } else {

          setDeletedIds((prev) => [...prev, id]);
        }
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 italic font-black uppercase tracking-widest">
      <Loader2 className="animate-spin mr-2" /> Loading Plans...
    </div>
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isDeletedInUI = deletedIds.includes(plan._id);

          return (
            <div 
              key={plan._id} 
              className={`relative border-[3px] rounded-[2.5rem] p-6 transition-all duration-300 flex flex-col ${
                isDeletedInUI 
                ? "bg-red-50 border-red-400" 
                : "bg-gray-50 border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="absolute top-5 right-5 flex gap-2">
                {!isDeletedInUI && (
                  <button 
                    onClick={() => { setSelectedPlanId(plan._id); setIsUpdateModalOpen(true); }}
                    className="p-2 bg-white text-blue-600 rounded-full border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                
                <button 
                  onClick={() => handleToggleDelete(plan._id, isDeletedInUI)}
                  disabled={processingId === plan._id}
                  className={`p-2 rounded-full border transition-all shadow-sm ${
                    isDeletedInUI 
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700" 
                    : "bg-white text-red-600 border-red-100 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {processingId === plan._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isDeletedInUI ? (
                    <RotateCcw size={16} /> 
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

    
              <div className="mb-4">
                <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${isDeletedInUI ? "text-red-700" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-xs font-bold mt-1 uppercase opacity-70">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-black ${isDeletedInUI ? "text-red-900" : "text-gray-900"}`}>${plan.price}</span>
                <span className="text-gray-400 font-bold text-sm lowercase">/{plan.durationUnit}</span>
              </div>

              <div className={`flex gap-4 mb-6 border-y py-4 font-black ${isDeletedInUI ? "border-red-200 text-red-700" : "border-gray-200 text-gray-700"}`}>
                 <div className="flex items-center gap-2 text-sm">
                    <Users size={18} /> {plan.limits.maxUsers}
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                    <FileText size={18} /> {plan.limits.maxScenarios}
                 </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`flex items-center gap-2 text-sm font-bold ${isDeletedInUI ? "text-red-600/70" : "text-gray-600"}`}>
                    <CheckCircle2 size={16} className={isDeletedInUI ? "text-red-400" : "text-green-500"} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={`text-center py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                isDeletedInUI ? "bg-red-700 text-white" : plan.isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {isDeletedInUI ? 'PLAN ARCHIVED' : plan.isActive ? 'Active Plan' : 'Inactive'}
              </div>
            </div>
          );
        })}
      </div>

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsUpdateModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-in zoom-in duration-300">
            <button onClick={() => setIsUpdateModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-gray-900">Update Plan</h2>
            <UpdatePlans id={selectedPlanId} onClose={() => { setIsUpdateModalOpen(false); fetchPlans(); }} />
          </div>
        </div>
      )}
    </div>
  );
}