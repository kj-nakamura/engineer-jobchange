import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="AQLIRXeD1sFmsA5azelUczhG4ch-lb8-o4pSYRHiWDI" />
        
        {/* Google Analytics 4 - Direct Implementation */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RSS6Q8WMW6"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RSS6Q8WMW6');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}