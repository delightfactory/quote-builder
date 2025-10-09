import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from './Button';
import Portal from './Portal';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  footer,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Size variants
  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
    lg: 'max-w-2xl sm:max-w-3xl lg:max-w-4xl',
    xl: 'max-w-3xl sm:max-w-4xl lg:max-w-5xl',
    full: 'max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw]',
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements?.length) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-modal overflow-y-auto modal-portal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 modal-overlay transition-opacity duration-300 animate-fadeIn"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4 lg:p-6 modal-container">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          tabIndex={-1}
          className={cn(
            'relative w-full transform overflow-hidden rounded-xl sm:rounded-2xl bg-background shadow-2xl transition-all duration-300 animate-scaleIn modal-content',
            'border border-border/50',
            'max-h-[95vh] sm:max-h-[90vh] lg:max-h-[85vh]',
            'flex flex-col',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={cn(
              'flex items-center justify-between p-4 sm:p-6 border-b border-border/50',
              'bg-gradient-to-r from-muted/30 to-muted/10',
              headerClassName
            )}>
              <div className="min-w-0 flex-1">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description"
                    className="text-sm sm:text-base text-muted-foreground mt-1"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0 ml-4 rounded-xl hover-scale mobile-tap"
                  aria-label="إغلاق النموذج"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn(
            'flex-1 overflow-y-auto p-4 sm:p-6 relative',
            'scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent',
            contentClassName
          )}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn(
              'border-t border-border/50 p-4 sm:p-6',
              'bg-gradient-to-r from-muted/20 to-muted/10',
              footerClassName
            )}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
};

export default Modal;
