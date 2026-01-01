type ActionButtonProps = {
  text: string;
  icon: string;
  onClick: () => void;
};

export default function ActionButton({ text, icon, onClick }: ActionButtonProps) {
  return (
    <button
      className='px-4 py-2 hover:opacity-80 transition bg-blue-500 text-white font-semibold rounded-lg'
      onClick={onClick}
    >
      {icon || ''} {text}
    </button>
  );
}
