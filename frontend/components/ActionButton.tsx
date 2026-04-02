import { ReactNode } from 'react';
import Spinner from './Spinner';

type ActionButtonProps = {
  text: string;
  type: 'button' | 'submit' | 'reset';
  icon?: ReactNode; // optionnel
  onClick?: () => void;
  isLoading?: boolean;
};

export default function ActionButton({
  text,
  type = 'button',
  icon,
  isLoading,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      className='px-4 justify-center py-2 hover:opacity-80 transition bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-3'
      onClick={onClick}
      type={type}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : icon} {text}
    </button>
  );
}
