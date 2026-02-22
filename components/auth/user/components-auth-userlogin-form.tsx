'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useUserLogin } from '@/components/hooks/useUser';

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.064 10.064 0 012.062-3.401m1.645-1.645A9.963 9.963 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.567 2.738M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
  </svg>
);

const ComponentsAuthUserLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useUserLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { username, password },
      {
        onError: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.response?.data?.message || 'Invalid username or password',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <div className="relative">
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="peer block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-primary transition"
        />
        <label
          htmlFor="username"
          className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
        >
          Username
        </label>
      </div>

      {/* Password Field */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="peer block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-primary transition"
        />
        <label
          htmlFor="password"
          className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary"
        >
          Password
        </label>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          {showPassword ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-2 px-4 text-white font-semibold hover:bg-primary-dark disabled:opacity-60 transition"
        disabled={isPending}
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default ComponentsAuthUserLoginForm;
