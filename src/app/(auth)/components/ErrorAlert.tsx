import React from 'react';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
};