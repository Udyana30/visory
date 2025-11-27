import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const AutoSaveIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      exit={{ y: -50, opacity: 0, x: "-50%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-20 left-1/2 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-6 py-3 flex items-center gap-3 min-w-[280px]">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Auto saving...</p>
          <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              className="bg-blue-600 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};