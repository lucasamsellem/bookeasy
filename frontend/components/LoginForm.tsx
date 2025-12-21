'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';
import { useMutation } from '@tanstack/react-query';

interface LoginBody {
  email: string;
  password: string;
}

// interface LoginResponse {
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
// }

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data: LoginBody) => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        },
      }
    );
  };

  return (
    <form
      className='w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md'
      onSubmit={handleSubmit}
    >
      <h1 className='text-center text-2xl font-semibold text-gray-800'>Login</h1>

      <div className='flex flex-col space-y-1'>
        <label htmlFor='email' className='text-sm text-gray-600'>
          Email
        </label>
        <input
          id='email'
          type='email'
          placeholder='you@example.com'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='flex flex-col space-y-1'>
        <label htmlFor='password' className='text-sm text-gray-600'>
          Password
        </label>
        <input
          id='password'
          type='password'
          placeholder='••••••••'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type='submit'
        className='w-full cursor-pointer rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        {isPending ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}
