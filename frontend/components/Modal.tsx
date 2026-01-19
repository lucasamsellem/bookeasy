// components/Modal.tsx
import { ReactNode, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Handler pour Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  // Empêcher le scroll derrière la modal
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

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose} // clic sur fond ferme la modal
    >
      <div
        className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'
        onClick={(e) => e.stopPropagation()} // empêcher propagation clic sur la modal
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
        >
          ✕
        </button>

        {/* Title */}
        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
