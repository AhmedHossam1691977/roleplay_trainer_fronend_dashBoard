'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const baseUrl = 'https://final-pro-api-j1v7.onrender.com';

const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgetPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/forgetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || result.status !== true) {
        throw new Error(result.message || 'Failed to send reset email');
      }

      // ✅ Toast Notification
      toast.success(result.subject || 'Please check your email');
      console.log();
      
      // 🚀 Redirect to verifyResetCode after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Forget Password</h1>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>
    </div>
  );
}
