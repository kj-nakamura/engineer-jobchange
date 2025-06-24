import React from 'react';

interface AffiliateButtonProps {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  trackingId?: string;
  fullWidth?: boolean;
  className?: string;
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
}) => {
  const handleClick = () => {
    // Google Analytics tracking
    if (typeof window !== 'undefined' && window.gtag && trackingId) {
      window.gtag('event', 'affiliate_click', {
        affiliate_id: trackingId,
        affiliate_url: href,
        event_category: 'affiliate',
        event_label: text,
      });
    }

    // Custom tracking (for future analytics dashboard)
    if (typeof window !== 'undefined') {
      try {
        const trackingData = {
          timestamp: new Date().toISOString(),
          trackingId,
          href,
          text,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        };
        
        // Store in localStorage for batch sending to analytics endpoint
        const existingData = localStorage.getItem('affiliate_clicks');
        const clicks = existingData ? JSON.parse(existingData) : [];
        clicks.push(trackingData);
        localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
      } catch (error) {
        console.warn('Failed to track affiliate click:', error);
      }
    }
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