import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { AvatarStatus } from '../types/domain/project';

interface StatusBadgeProps {
  status: AvatarStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    queued: {
      icon: Clock,
      text: 'Queued',
      style: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    processing: {
      icon: Loader2,
      text: 'Processing',
      style: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    finished: {
      icon: CheckCircle2,
      text: 'Completed',
      style: 'bg-green-50 text-green-700 border-green-200',
    },
    failed: {
      icon: AlertCircle,
      text: 'Failed',
      style: 'bg-red-50 text-red-700 border-red-200',
    },
  };

  const { icon: Icon, text, style } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${style} ${className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} />
      <span>{text}</span>
    </div>
  );
};