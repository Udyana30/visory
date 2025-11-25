'use client';

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
        {title}
      </h1>
      
      {subtitle && (
        <>
          <div className="h-10 w-px bg-gray-300 flex-shrink-0 mt-1"></div>
          <p className="text-sm text-gray-600 pt-1.5">
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
}