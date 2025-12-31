'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, Briefcase, ArrowRight, Info, Flame, HelpCircle, 
  AlertCircle, UserCheck, User, Edit3, ToggleLeft, ToggleRight, Loader2, SearchX,
  ChevronLeft, ChevronRight 
} from 'lucide-react';

import ScenarioDetailsModal from '../../../../components/ScenarioDetailsModal.jsx';
import UpdateScenario from '../updateScenario/UpdateScenario.jsx';

export default function AllScenario({ searchTerm, filters }) {
  const router = useRouter();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const [togglingId, setTogglingId] = useState(null); 

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [updatingScenarioId, setUpdatingScenarioId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchScenarios = useCallback(async (role, keyword = "", activeFilters = {}, page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (activeFilters.role) params.append('role', activeFilters.role);
      if (activeFilters.difficultyLevel) params.append('difficultyLevel', activeFilters.difficultyLevel);
      if (activeFilters.customerType) params.append('customerType', activeFilters.customerType);
      params.append('page', page);

      const url = `https://roleplay-trainer-api.vercel.app/api/v1/scenario?${params.toString()}`;
      
      const res = await fetch(url, {
        headers: { 
          token: `${token}`, 
          'Content-Type': 'application/json' 
        },
      });
      
      const data = await res.json();
      let allScenarios = data.scenarios || [];
      
      if (data.totalPages) {
        setTotalPages(data.totalPages);
      }

      if (role !== 'admin' && role !== 'super-admin') {
        allScenarios = allScenarios.filter(s => s.status === true && s.isDeleted === false);
      }
      
      setScenarios(allScenarios);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let role = null;
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      role = parsedUser.role;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchScenarios(role, searchTerm, filters, currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters, currentPage, fetchScenarios]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    setScenarios((prev) => prev.map((s) => s._id === updatedData._id ? { ...s, ...updatedData } : s));
  };

  const toggleStatus = async (scenarioId, currentDeletedStatus) => {
    setTogglingId(scenarioId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://roleplay-trainer-api.vercel.app/api/v1/scenario/${scenarioId}`, {
        method: 'DELETE', 
        headers: { token: `${token}` }
      });
      
      if (res.ok) {
        setScenarios(prev => prev.map(s => 
          s._id === scenarioId 
          ? { ...s, isDeleted: !currentDeletedStatus, status: currentDeletedStatus } 
          : s
        ));
      }
    } catch (err) { 
      console.error("Toggle Error:", err); 
    } finally { 
      setTogglingId(null); 
    }
  };

  const getCustomerStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'angry': return { color: 'text-red-600 bg-red-50 border-red-100', icon: <Flame size={14} /> };
      case 'confused': return { color: 'text-purple-600 bg-purple-50 border-purple-100', icon: <HelpCircle size={14} /> };
      case 'hesitant': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <AlertCircle size={14} /> };
      case 'normal': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <UserCheck size={14} /> };
      default: return { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: <User size={14} /> };
    }
  };

  const getDifficultyStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const canStartTraining = (scenario) => {
    if (user?.role === 'super-admin') return true;
    if (user?.role === 'admin' && (!user?.subscriptions || user?.subscriptions?.length === 0)) return false;
    return scenario.status === true && scenario.isDeleted === false;
  };

  if (loading && scenarios.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600 stroke-[3px]" />
      <p className="text-gray-400 font-black text-xs uppercase tracking-widest animate-pulse">Syncing Library...</p>
    </div>
  );

  return (
    <div className="p-2 sm:p-4">
      {scenarios.length > 0 ? (
        <>
          {/* Grid Layout: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {scenarios.map((scenario) => {
              const customerStyle = getCustomerStyle(scenario.customerType);
              const difficultyClass = getDifficultyStyle(scenario.difficultyLevel);
              const isActiveVisual = scenario.status === true && scenario.isDeleted === false;
              
              return (
                <div key={scenario._id} className={`group bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden ${!isActiveVisual ? 'opacity-60 grayscale-[0.8]' : ''}`}>
                  <div className={`h-2 w-full ${difficultyClass.split(' ')[1]}`}></div>
                  
                  <div className="p-4 sm:p-6 flex-1">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-1.5 border border-gray-200">
                          <Briefcase size={12} /> {scenario.role?.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase border ${difficultyClass}`}>
                        {scenario.difficultyLevel}
                      </span>
                    </div>

                    <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1 italic">{scenario.title}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-3 min-h-[3.5rem] sm:min-h-[4.5rem] mb-4 font-medium">{scenario.objective}</p>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                      <div className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-xl border ${customerStyle.color}`}>
                        {customerStyle.icon}
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter truncate">{scenario.customerType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 p-2 rounded-xl border border-gray-100 bg-gray-50 text-gray-600">
                        <Clock size={14} className="text-blue-500" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tighter">{scenario.expectedDuration} Min</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-6 bg-gray-50/80 border-t border-gray-100 flex gap-2 items-center">
                    <button onClick={() => setSelectedScenario(scenario)} className="p-2.5 sm:p-3 bg-white border border-gray-200 text-gray-500 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 shadow-sm">
                      <Info size={18} />
                    </button>

                    {(user?.role === 'admin' || user?.role === 'super-admin') && (
                      <>
                        <button onClick={() => { setUpdatingScenarioId(scenario._id); setIsUpdateModalOpen(true); }} className="p-2.5 sm:p-3 bg-white border border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 transition-all active:scale-90 shadow-sm">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(scenario._id, scenario.isDeleted)} 
                          disabled={togglingId === scenario._id} 
                          className={`p-2.5 sm:p-3 border rounded-2xl transition-all active:scale-90 shadow-sm ${!scenario.isDeleted ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-200 border-gray-300 text-gray-600'}`}
                        >
                          {togglingId === scenario._id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            !scenario.isDeleted ? <ToggleRight size={18} /> : <ToggleLeft size={18} />
                          )}
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => router.push(`/scenario/call/${scenario._id}`)} 
                      disabled={!canStartTraining(scenario)} 
                      className="flex-1 bg-blue-600 text-white py-3.5 sm:py-4 px-2 sm:px-4 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100 disabled:bg-gray-400 disabled:shadow-none"
                    >
                      <span className="truncate">
                        {user?.role === 'admin' && (!user?.subscriptions || user?.subscriptions?.length === 0) ? 'Upgrade' : 'Start'} 
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Responsive Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-8 sm:mt-12 pb-8">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none px-2 py-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
              
                  if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2) return null;
                  
                  return (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all border ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
      <div className="flex flex-col items-center justify-center py-16 sm:py-32 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 px-4 text-center">

    <SearchX className="text-gray-200 mb-4 sm:mb-6 stroke-[1px] w-12 h-12 sm:w-16 sm:h-16" />
    
    <h3 className="text-lg sm:text-xl font-black text-gray-800">No Matches Found</h3>
    <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">
      Try adjusting your filters or search keywords
    </p>
  </div>
      )}

      <ScenarioDetailsModal isOpen={!!selectedScenario} scenario={selectedScenario} onClose={() => setSelectedScenario(null)} getDifficultyStyle={getDifficultyStyle} getCustomerStyle={getCustomerStyle} />
      <UpdateScenario isOpen={isUpdateModalOpen} scenarioId={updatingScenarioId} onClose={() => setIsUpdateModalOpen(false)} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
}