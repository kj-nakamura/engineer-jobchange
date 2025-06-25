// Google Analytics ID validation and health check utilities

export const validateGoogleAnalyticsId = (id: string): boolean => {
  // GA4 IDs follow the format: G-XXXXXXXXXX
  const ga4Pattern = /^G-[A-Z0-9]{10}$/;
  return ga4Pattern.test(id);
};

export const checkAnalyticsHealth = async (trackingId: string): Promise<{
  isValid: boolean;
  isReachable: boolean;
  error?: string;
}> => {
  try {
    // Validate ID format
    const isValid = validateGoogleAnalyticsId(trackingId);
    if (!isValid) {
      return {
        isValid: false,
        isReachable: false,
        error: `Invalid Google Analytics ID format: ${trackingId}`
      };
    }

    // Check if Google Tag Manager is reachable
    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    
    try {
      const response = await fetch(scriptUrl, { 
        method: 'HEAD',
        mode: 'no-cors' // Avoid CORS issues
      });
      
      return {
        isValid: true,
        isReachable: true
      };
    } catch (fetchError) {
      // In production, this might fail due to CORS, but that's expected
      // The important thing is that the ID format is valid
      return {
        isValid: true,
        isReachable: false,
        error: `Could not verify reachability: ${fetchError}`
      };
    }
  } catch (error) {
    return {
      isValid: false,
      isReachable: false,
      error: `Health check failed: ${error}`
    };
  }
};

// Log analytics environment information
export const logAnalyticsEnvironment = () => {
  const info = {
    trackingId: process.env.NEXT_PUBLIC_GA_ID,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    debugMode: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG,
    timestamp: new Date().toISOString()
  };
  
  console.log('🔍 Analytics Environment Info:', info);
  
  if (info.trackingId) {
    const isValidFormat = validateGoogleAnalyticsId(info.trackingId);
    console.log(`📊 Analytics ID Format: ${isValidFormat ? '✅ Valid' : '❌ Invalid'}`);
  }
  
  return info;
};