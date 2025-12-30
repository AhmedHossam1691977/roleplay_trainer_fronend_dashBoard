'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const baseUrl = 'https://roleplay-trainer-api.vercel.app';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[#?!@$%^&*-]/, 'Password must contain at least one special character'),
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

      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('Login Success');
      router.push('/'); 
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
            {apiError}
          </div>
        )}

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forget Password Link */}
        <div className="text-right">
          <Link
            href="/forgetPassword"
            className="text-sm text-blue-600 hover:underline transition-all"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        {/* ✅ Registration Link Section */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Do not have an account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline transition-all">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}