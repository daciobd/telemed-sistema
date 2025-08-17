
// TeleMed Accessible Modal Component
// Compliant with WCAG 2.1 AA

import React, { useRef, useEffect } from 'react';
import { useKeyboardNavigation, useFocusManagement } from '../hooks/useAccessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useKeyboardNavigation(onClose);
  useFocusManagement(isOpen, titleRef);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const previouslyFocused = document.activeElement as HTMLElement;
      
      return () => {
        document.body.style.overflow = '';
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-md w-full mx-4 p-6"
        role="document"
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            ref={titleRef}
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
            tabIndex={-1}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
            aria-label="Fechar modal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};
