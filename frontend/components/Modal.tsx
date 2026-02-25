import { ReactNode, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;

  // 🔽 Ajouts pour confirmation
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isLoading = false,
  variant = 'default',
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const confirmButtonStyle =
    variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
        >
          ✕
        </button>

        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}

        <div className='mb-6'>{children}</div>

        {/* 🔽 Boutons affichés seulement si onConfirm existe */}
        {onConfirm && (
          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
              disabled={isLoading}
            >
              {cancelLabel}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded text-white ${confirmButtonStyle}`}
            >
              {isLoading ? '...' : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
