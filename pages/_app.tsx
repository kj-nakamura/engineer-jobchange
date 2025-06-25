import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import '../styles/globals.css'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import Header from '../components/Header'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { GA_TRACKING_ID, ANALYTICS_ENABLED } from '../lib/analytics'

export default function App({ Component, pageProps }: AppProps) {
  useScrollRestoration()
  
  useEffect(() => {
    console.log('🔍 Analytics Environment:', {
      enabled: ANALYTICS_ENABLED,
      trackingId: GA_TRACKING_ID,
      trackingIdLength: GA_TRACKING_ID.length,
      trackingIdValid: /^G-[A-Z0-9]{10}$/.test(GA_TRACKING_ID),
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    })
    
    // Validate Google Analytics ID format
    if (GA_TRACKING_ID && !/^G-[A-Z0-9]{10}$/.test(GA_TRACKING_ID)) {
      console.error('❌ Invalid Google Analytics ID format:', GA_TRACKING_ID)
      console.log('Expected format: G-XXXXXXXXXX (where X is alphanumeric)')
    }
    
    // Test analytics functionality after initialization
    setTimeout(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        console.log('✅ Google Analytics gtag function is available')
        console.log('📊 Google Analytics successfully loaded')
      } else {
        console.warn('❌ Google Analytics gtag function not available - likely due to 500 error')
        console.log('🔄 This is expected if there are server issues with Google Tag Manager')
      }
    }, 3000)
  }, [])
  
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Analytics */}
      {ANALYTICS_ENABLED && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
      <Analytics />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  )
}