'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Save, Loader2, Info, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; 

export default function AddPlans({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    durationUnit: 'month',
    limits: {
      maxUsers: 0,
      maxScenarios: 0
    },
    features: [''] 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLimitChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      limits: { ...prev.limits, [name]: parseInt(value) || 0 }
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const fetchPromise = fetch('https://roleplay-trainer-api.vercel.app/api/v1/plan', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        token: localStorage.getItem('token') 
      },
      body: JSON.stringify(formData),
    });

    
    toast.promise(
      fetchPromise.then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create plan');
        return json;
      }),
      {
        loading: 'Saving your plan...',
        success: (data) => {
          setTimeout(() => {
            if (onClose) onClose();
            window.location.reload();
          }, 1500);
          return <b>Plan created successfully! 🔥</b>;
        },
        error: (err) => `Error: ${err.message}`,
      },
      {
        style: {
          minWidth: '250px',
          borderRadius: '20px',
          background: '#000',
          color: '#fff',
          fontFamily: 'inherit',
          fontWeight: '900',
          fontSize: '12px',
          textTransform: 'uppercase'
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#fff', secondary: '#000' },
        },
      }
    ).finally(() => setLoading(false));
  };

  return (
    <>
      
      <Toaster position="top-center" reverseOrder={false} />
      
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
        
  
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block tracking-widest">Plan Name</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Gold Plan"
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block tracking-widest">Description</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Describe the plan benefits..."
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all resize-none"
            />
          </div>
        </div>

  
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Duration</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Unit</label>
            <select
              name="durationUnit"
              value={formData.durationUnit}
              onChange={handleChange}
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold outline-none focus:ring-2 focus:ring-black"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

    
        <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Info size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Plan Restrictions</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block opacity-70">Max Users</label>
              <input
                type="number"
                name="maxUsers"
                value={formData.limits.maxUsers}
                onChange={handleLimitChange}
                className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-bold text-white outline-none focus:bg-white/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block opacity-70">Max Scenarios</label>
              <input
                type="number"
                name="maxScenarios"
                value={formData.limits.maxScenarios}
                onChange={handleLimitChange}
                className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-bold text-white outline-none focus:bg-white/20"
              />
            </div>
          </div>
        </div>

      
        <div>
          <div className="flex justify-between items-center mb-3 px-4">
            <label className="text-[10px] font-black uppercase text-gray-400">Features List</label>
            <button
              type="button"
              onClick={addFeatureField}
              className="text-[10px] font-black bg-black text-white px-4 py-1.5 rounded-full hover:scale-105 transition-all flex items-center gap-1"
            >
              <Plus size={12} /> ADD FEATURE
            </button>
          </div>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 group animate-in slide-in-from-left-2 duration-200">
                <div className="flex-grow relative">
                  <CheckCircle2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    required
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-black transition-all"
                    placeholder={`Feature #${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeatureField(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>


        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-3xl py-4 font-black italic uppercase tracking-[0.25em] shadow-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Creating...' : 'Create New Plan'}
          </button>
        </div>
      </form>
    </>
  );
}