import React from 'react';
import { trackAffiliateClick } from '../lib/analytics';

interface AffiliateButtonProps {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  trackingId?: string;
  fullWidth?: boolean;
  className?: string;
  serviceName?: string;
  placement?: string;
  articleCategory?: string;
  articleId?: string;
}

const AffiliateButton: React.FC<AffiliateButtonProps> = ({
  href,
  text,
  variant = 'primary',
  size = 'md',
  icon,
  trackingId,
  fullWidth = false,
  className = '',
  serviceName = text,
  placement = 'affiliate_button',
  articleCategory,
  articleId,
}) => {
  const handleClick = () => {
    trackAffiliateClick({
      affiliate_id: trackingId || href,
      affiliate_url: href,
      service_name: serviceName,
      placement,
      article_category: articleCategory,
      article_id: articleId
    });
  };

  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:transform hover:scale-105 shadow-md hover:shadow-lg";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border-2 border-blue-600 hover:border-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 border-2 border-gray-600 hover:border-gray-700",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border-2 border-green-600 hover:border-green-700",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const iconClasses = icon ? "mr-2" : "";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      onClick={handleClick}
    >
      {icon && <span className={iconClasses}>{icon}</span>}
      {text}
      <svg 
        className="ml-2 w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
        />
      </svg>
    </a>
  );
};

export default AffiliateButton;