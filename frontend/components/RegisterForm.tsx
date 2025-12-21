'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';
import { useMutation } from '@tanstack/react-query';

type UserRole = 'customer' | 'professional';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  profession: string;
  address: string;
  role: UserRole;
}

const initialForm: RegisterBody = {
  name: '',
  email: '',
  password: '',
  profession: '',
  address: '',
  role: 'customer',
};

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterBody>(initialForm);

  const isProfessional = form.role === 'professional';

  const { mutate: register } = useMutation({
    mutationFn: async (data: RegisterBody) => {
      const res = await apiFetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? 'Register failed');
      }

      return res.json();
    },
  });

  const handleChange = (field: keyof RegisterBody) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRoleChange = (role: UserRole) => {
    setForm((prev) => ({
      ...prev,
      role,
      profession: role === 'professional' ? prev.profession : '',
      address: role === 'professional' ? prev.address : '',
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md'
    >
      <h1 className='text-center text-2xl font-semibold text-gray-800'>Register</h1>

      <h3>
        You are:{' '}
        <RoleButton
          label='Customer'
          isActive={form.role === 'customer'}
          onClick={() => handleRoleChange('customer')}
        />{' '}
        <RoleButton
          label='Professional'
          isActive={form.role === 'professional'}
          onClick={() => handleRoleChange('professional')}
        />
      </h3>

      <Input
        label='Name'
        id='name'
        value={form.name}
        onChange={handleChange('name')}
        placeholder='John Doe'
      />

      <Input
        label='Email'
        id='email'
        type='email'
        value={form.email}
        onChange={handleChange('email')}
        placeholder='you@example.com'
      />

      <Input
        label='Password'
        id='password'
        type='password'
        value={form.password}
        onChange={handleChange('password')}
        placeholder='••••••••'
      />

      {isProfessional && (
        <>
          <Input
            label='Profession'
            id='profession'
            value={form.profession}
            onChange={handleChange('profession')}
            placeholder='Photographer'
          />

          <Input
            label='Address'
            id='address'
            value={form.address}
            onChange={handleChange('address')}
            placeholder='Central Park, New York City, USA'
          />
        </>
      )}

      <button
        type='submit'
        className='w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        Confirm
      </button>
    </form>
  );
}

interface RoleButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function RoleButton({ label, isActive, onClick }: RoleButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`cursor-pointer transition ${
        isActive ? 'font-semibold opacity-100' : 'opacity-70 hover:opacity-100'
      }`}
    >
      {label}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({ label, id, ...props }: InputProps) {
  return (
    <div className='flex flex-col space-y-1'>
      <label htmlFor={id} className='text-sm text-gray-600'>
        {label}
      </label>
      <input
        id={id}
        required
        className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        {...props}
      />
    </div>
  );
}
