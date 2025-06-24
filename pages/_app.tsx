import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  useScrollRestoration()
  
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  )
}