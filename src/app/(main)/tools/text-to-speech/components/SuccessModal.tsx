import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-modal-appear border border-gray-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle size={40} className="text-green-600" strokeWidth={2.5} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Generation Successful!
            </h3>
            {title && (
              <p className="text-gray-600 text-base">
                <span className="font-semibold">{title}</span> has been generated
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Your audio is ready to play
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
          <div className="h-full bg-green-600 animate-progress" />
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-modal-appear {
          animation: modal-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-progress {
          animation: progress 2.5s linear;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;