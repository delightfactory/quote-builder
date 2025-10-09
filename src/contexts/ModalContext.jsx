import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalConfig) => {
    const id = Date.now().toString();
    const modal = { id, ...modalConfig };
    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const updateModal = useCallback((id, updates) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, ...updates } : modal
    ));
  }, []);

  // Helper functions for common modal types
  const showConfirm = useCallback(({
    title = 'تأكيد',
    message,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    onConfirm,
    onCancel,
    variant = 'destructive'
  }) => {
    const modalId = openModal({
      title,
      size: 'sm',
      children: (
        <div className="text-center space-y-4">
          <p className="text-base text-foreground">{message}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                onCancel?.();
                closeModal(modalId);
              }}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                closeModal(modalId);
              }}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                variant === 'destructive' 
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )
    });
    return modalId;
  }, [openModal, closeModal]);

  const showAlert = useCallback(({
    title = 'تنبيه',
    message,
    buttonText = 'موافق'
  }) => {
    const modalId = openModal({
      title,
      size: 'sm',
      children: (
        <div className="text-center space-y-4">
          <p className="text-base text-foreground">{message}</p>
          <button
            onClick={() => closeModal(modalId)}
            className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </button>
        </div>
      )
    });
    return modalId;
  }, [openModal, closeModal]);

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    showConfirm,
    showAlert
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Render all active modals with proper stacking */}
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          isOpen={true}
          onClose={() => closeModal(modal.id)}
          className={`modal-stack-${index}`}
          style={{ zIndex: 9999 + index }}
          {...modal}
        />
      ))}
    </ModalContext.Provider>
  );
};
