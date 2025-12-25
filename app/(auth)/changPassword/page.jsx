'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const baseUrl = 'https://final-pro-api-j1v7.onrender.com';

export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Send POST request to change password API
      const res = await fetch(`${baseUrl}/api/v1/auth/changePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to change password');
      }

      toast.success(result.message || 'Password changed successfully');
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
        <h1 className="text-2xl font-bold text-center">Change Password</h1>

        {/* Current Password */}
        <div>
          <input
            type="password"
            placeholder="Current Password"
            {...register('password', { required: 'Current password is required' })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* New Password */}
        <div>
          <input
            type="password"
            placeholder="New Password"
            {...register('newPassword', { required: 'New password is required' })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register('confirmPassword', { required: 'Confirm password is required' })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
