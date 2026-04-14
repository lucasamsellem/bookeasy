import { ReactNode } from 'react';
import Spinner from './Spinner';

type ActionButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function ActionButton({
  text,
  type = 'button',
  icon,
  isLoading,
  onClick,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      className='px-4 justify-center py-2 hover:opacity-80 transition bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed'
      onClick={onClick}
      type={type}
      disabled={isLoading || disabled}
    >
      {isLoading ? <Spinner color='border-white' /> : icon} {text}
    </button>
  );
}
