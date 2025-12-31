'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const baseUrl = 'https://roleplay-trainer-api.vercel.app';

// مخطط التحقق (Zod Schema)
const registerSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number')
    .regex(/[#?!@$%^&*-]/, 'Must contain one special character'),
  confirmPassword: z.string(),
  age: z.string().min(1, 'Age is required'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  company: z.object({
    name: z.string().min(2, 'Company name is required'),
    email: z.string().email('Invalid company email'),
    phone: z.string().min(10, 'Invalid company phone'),
    address: z.string().min(5, 'Address is required'),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    // ✅ تفعيل التحقق اللحظي أثناء الكتابة
    mode: 'onChange', 
    defaultValues: {
      company: { name: '', email: '', phone: '', address: '' }
    }
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result.status !== true) {
        throw new Error(result.message || 'Registration failed');
      }

      Cookies.set('token', result.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(result.user), { expires: 7 });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      router.push('/');
    } catch (error) {
      setApiError(error.message);
    }
  };

  // وظيفة مساعدة لإضافة كلاسات التنسيق بناءً على وجود خطأ
  const inputClasses = (error) => `
    w-full px-4 py-2.5 bg-gray-50 border rounded-lg outline-none transition-all duration-200
    ${error 
      ? 'border-red-500 focus:ring-2 focus:ring-red-100' 
      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Join Us</h1>
          <p className="text-gray-500 mt-2 font-medium">Create your professional profile today</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm font-bold animate-pulse">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Section 1: Personal Details */}
          <div className="space-y-5">
            <h3 className="text-lg font-black text-blue-600 uppercase tracking-widest border-b pb-2">Personal Details</h3>
            
            <div>
              <input {...register('name')} placeholder="Full Name" className={inputClasses(errors.name)} />
              {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.name.message}</p>}
            </div>

            <div>
              <input {...register('email')} placeholder="Email Address" className={inputClasses(errors.email)} />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
            </div>

            <div className="flex gap-3">
              <div className="w-1/3">
                <input {...register('age')} type="number" placeholder="Age" className={inputClasses(errors.age)} />
                {errors.age && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.age.message}</p>}
              </div>
              <div className="w-2/3">
                <input {...register('phoneNumber')} placeholder="Phone Number" className={inputClasses(errors.phoneNumber)} />
                {errors.phoneNumber && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.phoneNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <input type="password" {...register('password')} placeholder="Password" className={inputClasses(errors.password)} />
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase leading-tight">{errors.password.message}</p>}
              </div>
              <div>
                <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" className={inputClasses(errors.confirmPassword)} />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Company Details */}
          <div className="space-y-5">
            <h3 className="text-lg font-black text-blue-600 uppercase tracking-widest border-b pb-2">Company Details</h3>
            
            <div>
              <input {...register('company.name')} placeholder="Company Name" className={inputClasses(errors.company?.name)} />
              {errors.company?.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.company.name.message}</p>}
            </div>

            <div>
              <input {...register('company.email')} placeholder="Company Email" className={inputClasses(errors.company?.email)} />
              {errors.company?.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.company.email.message}</p>}
            </div>

            <div>
              <input {...register('company.phone')} placeholder="Company Phone" className={inputClasses(errors.company?.phone)} />
              {errors.company?.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.company.phone.message}</p>}
            </div>

            <div>
              <textarea {...register('company.address')} placeholder="Company Address" rows="3" className={`${inputClasses(errors.company?.address)} resize-none`} />
              {errors.company?.address && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.company.address.message}</p>}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
          
          <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </form>
    </div>
  );
}