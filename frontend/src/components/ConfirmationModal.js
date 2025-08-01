import React from 'react';
import Modal from './Modal';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Подтверждение', 
    message, 
    confirmText = 'Подтвердить', 
    cancelText = 'Отмена',
    loading = false 
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="confirmation-modal">
                <div className="confirmation-message">
                    {message}
                </div>
                
                <div className="confirmation-actions">
                    <button 
                        type="button" 
                        className="confirmation-btn confirmation-btn-cancel" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        className="confirmation-btn confirmation-btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Выполнение...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;