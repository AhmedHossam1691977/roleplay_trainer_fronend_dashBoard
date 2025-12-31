'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const baseUrl = 'https://roleplay-trainer-api.vercel.app';

// تعريف شروط التحقق (Validation Schema)
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[#?!@$%^&*-]/, 'Must contain at least one special character'),
});

export default function Page() {
  const router = useRouter();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    // ✅ التعديل الجوهري: 'onChange' تجعل التحقق يحدث مع كل حرف تكتبه
    mode: 'onChange', 
  });

  const onSubmit = async (data) => {
    setApiError(''); 

    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result.status !== true) {
        throw new Error(result.message || 'Invalid email or password');
      }

      const { token, user } = result;

      // حفظ البيانات في Cookies و LocalStorage
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/'); 
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-5"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-center text-gray-900">Welcome Back</h1>
          <p className="text-center text-gray-500 text-sm font-medium">Please enter your details</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {apiError}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase ml-1">Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            {...register('email')}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 focus:ring-red-100' 
                : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 font-bold ml-1 animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase ml-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
              errors.password 
                ? 'border-red-500 focus:ring-red-100' 
                : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 font-bold ml-1 leading-relaxed animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgetPassword"
            className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging in...
            </span>
          ) : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600 pt-2 font-medium">
          New here?{' '}
          <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}