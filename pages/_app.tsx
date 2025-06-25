import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Script from 'next/script'
import '../styles/globals.css'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import Header from '../components/Header'
import { GA_TRACKING_ID, ANALYTICS_ENABLED, ANALYTICS_MOCK_MODE, pageview } from '../lib/analytics'
import { logAnalyticsEnvironment } from '../lib/analytics-validation'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useScrollRestoration()
  
  useEffect(() => {
    // Log analytics environment on app initialization
    logAnalyticsEnvironment()
    
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Google Analytics 4 - Development debug or Vercel production */}
      {ANALYTICS_ENABLED && !ANALYTICS_MOCK_MODE && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            onLoad={() => {
              console.log('Google Analytics script loaded successfully')
            }}
            onError={(error) => {
              console.error('❌ Failed to load Google Analytics script:', error)
              console.error('GA_TRACKING_ID:', GA_TRACKING_ID)
              console.error('Script URL:', `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`)
              console.error('Environment:', process.env.NODE_ENV)
              console.error('Vercel Environment:', process.env.VERCEL_ENV)
              
              // Track the error for debugging
              if (typeof window !== 'undefined') {
                window.gtag = window.gtag || function() {
                  console.warn('Google Analytics not loaded - using fallback function');
                };
              }
            }}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            onLoad={() => {
              console.log('Google Analytics configured')
            }}
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_location: window.location.href,
                  page_title: document.title,
                  send_page_view: true,
                  debug_mode: ${process.env.NODE_ENV === 'development'}
                });
                console.log('Analytics initialized with ID: ${GA_TRACKING_ID}');
              `,
            }}
          />
        </>
      )}
      
      {/* Mock Analytics for Development */}
      {ANALYTICS_ENABLED && ANALYTICS_MOCK_MODE && (
        <Script
          id="mock-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Mock Google Analytics for development
              window.dataLayer = window.dataLayer || [];
              window.gtag = function gtag(){
                console.log('Mock Analytics Event:', arguments);
                window.dataLayer.push(arguments);
              };
              window.gtag('js', new Date());
              window.gtag('config', '${GA_TRACKING_ID}', {
                page_location: window.location.href,
                page_title: document.title,
                send_page_view: true,
                debug_mode: true
              });
              console.log('Mock Analytics initialized with ID: ${GA_TRACKING_ID}');
            `,
          }}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  )
}