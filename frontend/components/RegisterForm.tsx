'use client';

import { useState } from 'react';
import { apiFetch } from '@/services/api';
import { useMutation } from '@tanstack/react-query';
import PasswordStrengthBar from './PasswordStrengthBar';
import PasswordInput from './PasswordInput';
import { Role } from '@backend/controllers/user.controller';

interface Address {
  street: string;
  streetNumber: string;
  city: string;
}

export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profession: string;
  address: Address;
  role: Role;
}

const initialForm: RegisterBody = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  profession: '',
  address: {
    street: '',
    streetNumber: '',
    city: '',
  },
  role: 'customer',
};

// au moins 8 caractères
// au moins 1 minuscule
// au moins 1 majuscule
// au moins 1 chiffre
// au moins 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterBody>(initialForm);

  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isProfessional = form.role === 'professional';

  const isFormValid =
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.email.trim() !== '' &&
    isPasswordValid &&
    (!isProfessional ||
      (form.profession.trim() !== '' &&
        form.address.street.trim() !== '' &&
        form.address.streetNumber.trim() !== '' &&
        form.address.city.trim() !== ''));

  const { mutate: register, isSuccess } = useMutation({
    mutationFn: async (data: RegisterBody) => {
      return apiFetch('/users', { method: 'POST', body: JSON.stringify(data) });
    },
  });

  const handleChange = (field: keyof RegisterBody) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAddressChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: e.target.value,
        },
      }));
    };

  const handleRoleChange = (role: Role) => {
    setForm((prev) => ({
      ...prev,
      role,
      profession: role === 'professional' ? prev.profession : '',
      address: role === 'professional' ? prev.address : { street: '', streetNumber: '', city: '' },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    register(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-md'
    >
      <h1 className='text-center text-2xl font-semibold text-gray-800'>Register</h1>

      <FormSection title='Role'>
        <h3 className='text-sm'>
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
      </FormSection>

      <FormSection title='Identity'>
        <Input
          label='First name'
          id='firstName'
          value={form.firstName}
          onChange={handleChange('firstName')}
        />

        <Input
          label='Last name'
          id='lastName'
          value={form.lastName}
          onChange={handleChange('lastName')}
        />
      </FormSection>

      <FormSection title='Login information'>
        <Input
          label='Email'
          id='email'
          type='email'
          value={form.email}
          onChange={handleChange('email')}
        />

        <PasswordInput value={form.password} handleChange={handleChange('password')} />

        {form.password && <PasswordStrengthBar form={form} />}
      </FormSection>

      {isProfessional && (
        <FormSection title='Professional details'>
          <Input
            label='Profession'
            id='profession'
            value={form.profession}
            onChange={handleChange('profession')}
          />

          <Input
            label='Street'
            id='street'
            value={form.address.street}
            onChange={handleAddressChange('street')}
          />

          <Input
            label='Street number'
            id='streetNumber'
            value={form.address.streetNumber}
            onChange={handleAddressChange('streetNumber')}
          />

          <Input
            label='City'
            id='city'
            value={form.address.city}
            onChange={handleAddressChange('city')}
          />
        </FormSection>
      )}

      <button
        type='submit'
        disabled={!isFormValid}
        className={`w-full rounded-md py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isFormValid
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed!'
        }`}
      >
        Confirm
      </button>

      {isSuccess && (
        <p className='text-center font-semibold text-green-500'>User registered successfully!</p>
      )}
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
      className={`transition ${
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

export function Input({ label, id, ...props }: InputProps) {
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

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className='space-y-3'>
      <h2 className='text-sm font-semibold uppercase tracking-wide text-gray-500'>{title}</h2>

      <div className='space-y-4 border-l-2 border-gray-100 pl-4'>{children}</div>
    </section>
  );
}
