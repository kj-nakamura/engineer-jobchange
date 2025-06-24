import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export default function App({ Component, pageProps }: AppProps) {
  useScrollRestoration()
  
  return <Component {...pageProps} />
}