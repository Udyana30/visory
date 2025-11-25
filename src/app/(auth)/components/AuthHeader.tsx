import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showMobileLogo?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  showMobileLogo = true,
}) => {
  return (
    <>
      {showMobileLogo && (
        <div className="lg:hidden mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">visory</h1>
        </div>
      )}
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 mb-10 text-center">{subtitle}</p>
      )}
    </>
  );
};