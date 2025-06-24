import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Script from 'next/script'
import '../styles/globals.css'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import Header from '../components/Header'
import { GA_TRACKING_ID, pageview } from '../lib/analytics'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useScrollRestoration()
  
  useEffect(() => {
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
      
      {/* Google Analytics 4 */}
      {GA_TRACKING_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_location: window.location.href,
                  page_title: document.title,
                  send_page_view: true
                });
              `,
            }}
          />
        </>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  )
}