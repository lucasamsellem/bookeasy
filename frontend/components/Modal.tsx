import { ReactNode, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Spinner from './Spinner';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
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

  return ReactDOM.createPortal(
    <div className='modal' onClick={onClose}>
      <div className='modal__content' onClick={(e) => e.stopPropagation()}>
        <button className='modal__close' onClick={onClose}>
          ✕
        </button>

        {title && <h2 className='modal__title'>{title}</h2>}

        <div className='modal__body'>{children}</div>

        {onConfirm && (
          <div className='modal__actions'>
            <button
              onClick={onClose}
              className='modal__btn modal__btn--secondary'
              disabled={isLoading}
            >
              {cancelLabel}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`modal__btn modal__btn--primary modal__btn--${variant}`}
            >
              {isLoading ? <Spinner /> : confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
