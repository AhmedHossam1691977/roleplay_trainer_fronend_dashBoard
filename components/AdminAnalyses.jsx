'use client';
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Users, Target, Award, PieChart, Briefcase } from 'lucide-react';
import Loading from '../app/loading.jsx';

export default function AdminAnalyses() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://roleplay-trainer-api.vercel.app";

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/dashboardAnalytics/adminAnalytics`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Loading/>
    );
  }

  /* =======================
     Cards Mapping (Using the new Data Structure)
  ======================= */
  const stats = [
    {
      title: 'Team Sessions',
      value: data?.cards?.totalTeamSessions || 0,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Employees',
      value: data?.cards?.totalEmployees || 0,
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Success Rate',
      value: data=== NaN?.cards?.teamSuccessRate || "0%",
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Avg Team Score',
      value: data?.cards?.averageTeamScore || 0,
      icon: Award,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  /* =======================
     Charts Formatting
  ======================= */
  // التأكد من وجود بيانات للرسم البياني أو عرض مصفوفة فارغة
  const sessionActivityData = data?.sessionActivity?.length > 0 
    ? data.sessionActivity.map(item => ({
        name: `${item._id.day}/${item._id.month}`,
        sessions: item.sessions,
        completions: item.completions
      }))
    : [];

  const performanceData = [
    { category: 'Empathy', current: data?.evaluations?.avgEmpathy || 0 },
    { category: 'Problem Solving', current: data?.evaluations?.avgProblemSolving || 0 },
    { category: 'Tone', current: data?.evaluations?.avgTone || 0 },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">TEAM ANALYTICS</h1>
          <p className="text-gray-500 font-medium">Monitoring your team performance and training activity</p>
        </header>

        {/* ================= Stats Cards ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon size={24} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>

        {/* ================= Main Charts ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Session Activity Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 uppercase text-sm tracking-tighter">
              <TrendingUp size={20} className="text-blue-600" /> Team Daily Activity
            </h2>
            {sessionActivityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessionActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="sessions" stroke="#2563eb" strokeWidth={4} dot={{r: 6}} activeDot={{r: 8}} />
                  <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={4} dot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                 <p className="text-gray-400 font-bold italic">No activity recorded yet</p>
              </div>
            )}
          </div>

          {/* Performance Radar/Bar Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 uppercase text-sm tracking-tighter">
              <Award size={20} className="text-orange-600" /> Skill Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="current" radius={[10, 10, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#8b5cf6'][index % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= Bottom Quick Stats ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Briefcase size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Library Size</p>
              <p className="text-xl font-black text-gray-900">{data?.scenarios?.total} Scenarios</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Users size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Team Members</p>
              <p className="text-xl font-black text-gray-900">{data?.team?.activeUsers} Active</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Target size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Success Rate</p>
              <p className="text-xl font-black text-gray-900">{data?.cards?.teamSuccessRate}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}