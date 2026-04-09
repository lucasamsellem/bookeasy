'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import PasswordStrengthBar from '../../../components/PasswordStrengthBar';
import PasswordInput from '../../../components/PasswordInput';
import useCreateUser from '@/hooks/users/useCreateUser';
import { Role } from '@/types/types';

export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profession: string;
  street: string;
  streetNumber: string;
  city: string;
  role: Role;
}

export const initialForm: RegisterBody = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  profession: '',
  street: '',
  streetNumber: '',
  city: '',
  role: 'customer',
};

// au moins 8 caractères
// au moins 1 minuscule
// au moins 1 majuscule
// au moins 1 chiffre
// au moins 1 caractère spécial
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export interface RegisterFormRef {
  submit: () => Promise<void>;
}

interface RegisterFormProps {
  allowedRoles?: Role[];
}

export const RegisterForm = forwardRef<RegisterFormRef, RegisterFormProps>(
  ({ allowedRoles = ['customer', 'professional'] }, ref) => {
    const { createUser, createUserFromAdmin, isUserCreated } = useCreateUser();

    const [form, setForm] = useState<RegisterBody>(initialForm);

    const isPasswordValid = PASSWORD_REGEX.test(form.password);
    const isProfessional = form.role === 'professional';
    const hasSuperAdmin = allowedRoles.includes('superAdmin');

    const isFormValid =
      form.firstName.trim() !== '' &&
      form.lastName.trim() !== '' &&
      form.email.trim() !== '' &&
      isPasswordValid &&
      (!isProfessional ||
        (form.profession.trim() !== '' &&
          form.street.trim() !== '' &&
          form.streetNumber.trim() !== '' &&
          form.city.trim() !== ''));

    const handleChange =
      (field: keyof RegisterBody) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

    const handleRoleChange = (role: Role) => {
      setForm((prev) => ({
        ...prev,
        role,
        profession: role === 'professional' ? prev.profession : '',
        street: role === 'professional' ? prev.street : '',
        streetNumber: role === 'professional' ? prev.streetNumber : '',
        city: role === 'professional' ? prev.city : '',
      }));
    };

    const submitForm = async () => {
      if (!isFormValid) return;

      if (hasSuperAdmin) {
        await createUserFromAdmin(form);
        return;
      }

      await createUser(form);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await submitForm();
    };

    useImperativeHandle(ref, () => ({
      submit: submitForm,
    }));

    return (
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-sm space-y-8 rounded-2xl bg-white p-6 shadow-md'
      >
        {!hasSuperAdmin && (
          <h1 className='text-center text-2xl font-semibold text-gray-800'>S&apos;inscrire</h1>
        )}

        <FormSection title='Rôle'>
          <div className='flex gap-3 text-sm'>
            {allowedRoles.includes('customer') && (
              <RoleButton
                label='Client'
                isActive={form.role === 'customer'}
                onClick={() => handleRoleChange('customer')}
              />
            )}

            {allowedRoles.includes('professional') && (
              <RoleButton
                label='Prestataire'
                isActive={form.role === 'professional'}
                onClick={() => handleRoleChange('professional')}
              />
            )}

            {hasSuperAdmin && (
              <RoleButton
                label='Administrateur'
                isActive={form.role === 'superAdmin'}
                onClick={() => handleRoleChange('superAdmin')}
              />
            )}
          </div>
        </FormSection>

        <FormSection title='Identité'>
          <Input
            label='Prénom'
            id='firstName'
            value={form.firstName}
            onChange={handleChange('firstName')}
          />

          <Input
            label='Nom'
            id='lastName'
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
        </FormSection>

        <FormSection title='Authentification'>
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
              value={form.street}
              onChange={handleChange('street')}
            />

            <Input
              label='Street number'
              id='streetNumber'
              value={form.streetNumber}
              onChange={handleChange('streetNumber')}
            />

            <Input label='City' id='city' value={form.city} onChange={handleChange('city')} />
          </FormSection>
        )}

        {!hasSuperAdmin && (
          <button
            type='submit'
            disabled={!isFormValid}
            className={`w-full rounded-md py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isFormValid
                ? 'bg-blue-500 text-white hover:bg-blue-400 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed!'
            }`}
          >
            Confirmer
          </button>
        )}

        {isUserCreated && (
          <p className='text-center font-semibold text-green-500'>User registered successfully!</p>
        )}
      </form>
    );
  },
);

RegisterForm.displayName = 'RegisterForm';

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
