'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, Info, target } from 'lucide-react';

export default function UpdatePlans({ id, onClose }) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    durationUnit: 'month',
    limits: { maxUsers: 0, maxScenarios: 0 },
    features: []
  });

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch(`https://roleplay-trainer-api.vercel.app/api/v1/plan/${id}`);
        const json = await response.json();
        if (json.success) {
          const plan = json.data;
          setFormData({
            name: plan.name || '',
            description: plan.description || '',
            price: plan.price || 0,
            duration: plan.duration || 1,
            durationUnit: plan.durationUnit || 'month',
            limits: {
              maxUsers: plan.limits?.maxUsers || 0,
              maxScenarios: plan.limits?.maxScenarios || 0
            },
            features: plan.features || []
          });
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlanDetails();
  }, [id]);


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

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(`https://roleplay-trainer-api.vercel.app/api/v1/plan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' , token: localStorage.getItem('token') },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onClose();
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <Loader2 className="animate-spin text-gray-900 mb-2" size={32} />
      <p className="text-xs font-black italic uppercase tracking-widest">Fetching Data...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
      

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Plan Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all resize-none"
          />
        </div>
      </div>


      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Price ($)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Duration</label>
          <input
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block">Unit</label>
          <select
            name="durationUnit"
            value={formData.durationUnit}
            onChange={handleChange}
            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black transition-all"
          >
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>


      <div className="bg-gray-900 rounded-[2rem] p-6 text-white">
        <div className="flex items-center gap-2 mb-4 opacity-50">
          <Info size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Usage Limits</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black uppercase mb-1 block opacity-70">Max Users</label>
            <input
              name="maxUsers"
              type="number"
              value={formData.limits.maxUsers}
              onChange={handleLimitChange}
              className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-bold text-white outline-none focus:bg-white/20 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase mb-1 block opacity-70">Max Scenarios</label>
            <input
              name="maxScenarios"
              type="number"
              value={formData.limits.maxScenarios}
              onChange={handleLimitChange}
              className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-bold text-white outline-none focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      
      <div>
        <div className="flex justify-between items-center mb-3 px-4">
          <label className="text-[10px] font-black uppercase text-gray-400">Features</label>
          <button
            type="button"
            onClick={addFeature}
            className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full hover:scale-105 transition-transform"
          >
            + ADD NEW
          </button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 group">
              <input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-black transition-all"
                placeholder="Enter feature..."
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
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
          disabled={updating}
          className="w-full bg-black text-white rounded-2xl py-4 font-black italic uppercase tracking-[0.2em] shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {updating ? 'Processing...' : 'Update Plan'}
        </button>
      </div>
    </form>
  );
}