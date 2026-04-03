import { ChangeEvent, useState } from 'react';
import { Input } from '../features/users/components/RegisterForm';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/solid';

type PasswordInputProps = {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function PasswordInput({ value, handleChange }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <Input
        label='Mot de passe'
        id='password'
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={handleChange}
      />

      <button
        type='button'
        onClick={() => setShowPassword((prev) => !prev)}
        className='absolute right-3 top-8 flex items-center'
      >
        {showPassword ? (
          <EyeSlashIcon className='h-5 w-5 text-gray-500' />
        ) : (
          <EyeIcon className='h-5 w-5 text-gray-500' />
        )}
      </button>
    </div>
  );
}
