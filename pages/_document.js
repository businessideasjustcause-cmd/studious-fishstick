import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Favicons & Brand Assets */}
        <link rel="icon" href="/Tutor.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/Tutor.svg" />
        <link rel="apple-touch-icon" href="/Tutor.svg" />
        
        {/* Primary Meta Tags */}
        <meta name="theme-color" content="#4f46e5" />
        <meta name="description" content="DraftStudio: The intelligent workspace for educators to generate standards-aligned curriculum in seconds." />
        
        {/* Performance & Font Optimization - 2026 Standards */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com"
          rel="stylesheet"
        />

        {/* Essential 2026 Open Graph / Social Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DraftStudio" />
        <meta property="og:title" content="DraftStudio | Intelligent Educator Workspace" />
        <meta property="og:image" content="/og-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
