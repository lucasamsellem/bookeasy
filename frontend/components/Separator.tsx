type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export default function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  const baseClass = 'bg-gray-200';
  const orientationClass = orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch';

  return (
    <div
      role='separator'
      aria-orientation={orientation}
      className={`${baseClass} ${orientationClass} ${className}`}
    />
  );
}
