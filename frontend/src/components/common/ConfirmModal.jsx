// ConfirmModal — reusable confirmation dialog for destructive actions
import { useEffect } from 'react';
import Button from './Button';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', loading = false, isDangerous = false }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel, loading]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal__overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal__header ${isDangerous ? 'confirm-modal__header--danger' : ''}`}>
          <h3 className="confirm-modal__title">{title}</h3>
        </div>
        <div className="confirm-modal__body">
          <p className="confirm-modal__message">{message}</p>
        </div>
        <div className="confirm-modal__actions">
          <Button variant="secondary" onClick={onCancel} disabled={loading} type="button">
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? 'Please wait...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
