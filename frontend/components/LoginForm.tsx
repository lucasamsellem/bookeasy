'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import { type User } from '@backend/controllers/user.controller';
import PasswordInput from './PasswordInput';
import './LoginForm.scss';

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    mutate: loginMutation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: LoginBody) => {
      return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = '/';
        },
      },
    );
  };

  return (
    <form className='login' onSubmit={handleSubmit}>
      <h1 className='login__title'>Login</h1>

      <div className='login__field'>
        <label htmlFor='email' className='login__label'>
          Email
        </label>
        <input
          id='email'
          type='email'
          placeholder='you@example.com'
          className='login__input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <PasswordInput value={password} handleChange={(e) => setPassword(e.target.value)} />

      <button type='submit' className='login__submit'>
        {isPending ? 'Loading...' : 'Submit'}
      </button>

      {isSuccess && <p className='login__success'>Login successful!</p>}
      {isError && <p className='login__error'>Login failed ({error?.message})</p>}
    </form>
  );
}
