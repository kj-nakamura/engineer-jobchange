import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://job.tabmac.site/#website",
        "url": "https://job.tabmac.site/",
        "name": "エンジニア転職ナビ",
        "description": "エンジニアの転職活動を支援する情報サイト。転職サイト比較、職種別ガイド、キャリア戦略など転職成功のための情報を提供。",
        "publisher": {
          "@id": "https://job.tabmac.site/#organization"
        },
        "inLanguage": "ja",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://job.tabmac.site/articles?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://job.tabmac.site/#organization",
        "name": "エンジニア転職ナビ",
        "url": "https://job.tabmac.site/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://job.tabmac.site/favicon.svg"
        },
        "description": "エンジニアの転職活動を支援する情報サイト",
        "sameAs": []
      }
    ]
  };

  return (
    <Html lang="ja">
      <Head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="AQLIRXeD1sFmsA5azelUczhG4ch-lb8-o4pSYRHiWDI" />
        
        {/* サイト全体の構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
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