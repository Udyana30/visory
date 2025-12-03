import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ManualSaveDialogProps {
  isSuccess?: boolean;
  error?: string | null;
  message?: string;
}

export const ManualSaveDialog: React.FC<ManualSaveDialogProps> = ({ isSuccess, error, message }) => {
  const renderContent = () => {
    if (error) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Save Failed</h3>
          <p className="text-gray-600 text-center text-sm">{error}</p>
        </motion.div>
      );
    }

    if (isSuccess) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Saved Successfully</h3>
          <p className="text-gray-600 text-center text-sm">
            {message || "Your comic project has been saved"}
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Saving Your Work</h3>
        <p className="text-gray-600 text-center text-sm">
          {message || "Please wait while we save your comic project..."}
        </p>
        <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="bg-blue-600 h-full rounded-full w-1/2"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4"
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};