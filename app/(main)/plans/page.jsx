'use client';
import React, { useEffect, useState } from 'react';
import { Check, Zap, Star, ShieldCheck, Users } from 'lucide-react';
import Cookies from 'js-cookie';

const baseUrl = 'https://roleplay-trainer-api.vercel.app';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/plan`);
        const result = await res.json();
        if (result.success) {
          setPlans(result.data);
        } else {
          throw new Error('Failed to load plans');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async (planId) => {
    setProcessingId(planId);
    try {
      const token = Cookies.get('token'); 

      const res = await fetch(`${baseUrl}/api/v1/payment/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token 
        },
        body: JSON.stringify({ planId })
      });

      const result = await res.json();

      if (result.success && result.paymentUrl) {
        localStorage.clear();

        Object.keys(Cookies.get()).forEach(cookieName => {
          Cookies.remove(cookieName);
        });

      
        window.location.href = result.paymentUrl;
      } else {
        alert(result.message || "Payment failed to initialize");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong with the payment process");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-500 mt-4 text-lg">Subscribe to activate your account and access all features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
          >
            <div className={`p-8 ${plan.name.toLowerCase() === 'gold' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  plan.name.toLowerCase() === 'gold' ? 'bg-orange-200 text-orange-700' : 'bg-blue-200 text-blue-700'
                }`}>
                  {plan.name}
                </span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                <span className="text-gray-500 font-medium">/{plan.durationUnit}</span>
              </div>
              <p className="mt-4 text-gray-600 text-sm">{plan.description}</p>
            </div>

            <div className="p-8 flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <Users className="text-green-500" size={18} />
                  <span>Up to {plan.limits.maxUsers} Users</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <ShieldCheck className="text-green-500" size={18} />
                  <span>{plan.limits.maxScenarios} Scenarios</span>
                </div>
                <hr className="border-gray-100" />
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="text-blue-500" size={16} strokeWidth={3} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 pt-0">
              <button 
                onClick={() => handlePayment(plan._id)}
                disabled={processingId !== null}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg disabled:opacity-50 ${
                plan.name.toLowerCase() === 'gold' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {processingId === plan._id ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}