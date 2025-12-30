'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const baseUrl = 'https://roleplay-trainer-api.vercel.app';

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

      // Save and Redirect
      Cookies.set('token', result.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(result.user), { expires: 7 });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      router.push('/');
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us and start your journey</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 border-b pb-1">Personal Info</h3>
            
            <div>
              <input {...register('name')} placeholder="Full Name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <input {...register('email')} placeholder="Personal Email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex gap-2">
              <div className="w-1/3">
                <input {...register('age')} type="number" placeholder="Age" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="w-2/3">
                <input {...register('phoneNumber')} placeholder="Phone Number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-3">
              <input type="password" {...register('password')} placeholder="Password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Section 2: Company Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 border-b pb-1">Company Info</h3>
            
            <input {...register('company.name')} placeholder="Company Name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input {...register('company.email')} placeholder="Company Email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input {...register('company.phone')} placeholder="Company Phone" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <textarea {...register('company.address')} placeholder="Company Address" rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : 'Create Account'}
          </button>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </form>
    </div>
  );
}