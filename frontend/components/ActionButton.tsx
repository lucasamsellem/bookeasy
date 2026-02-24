import { ReactNode } from 'react';

type ActionButtonProps = {
  text: string;
  icon?: ReactNode; // optionnel
  onClick: () => void;
};

export default function ActionButton({ text, icon, onClick }: ActionButtonProps) {
  return (
    <button
      className='px-4 py-2 hover:opacity-80 transition bg-blue-500 text-white font-semibold rounded-lg flex items-center gap-2'
      onClick={onClick}
    >
      {icon} {text}
    </button>
  );
}
