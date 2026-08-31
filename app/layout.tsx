import type { Metadata } from 'next';
import { Archivo, Newsreader } from 'next/font/google';
import '@/styles/globals.css';

import { metadata as meta } from './config';

const archivo = Archivo({ subsets: ['latin'], variable: '--font-display' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif', adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(meta.site.url),
  title: {
    default: meta.site.title,
    template: `%s | ${meta.site.title}`
  },
  description: meta.site.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.author.name, // or meta.site.title
    description: meta.site.description,
    // site: '@username',
    // siteId: 'id',
    // creator: '@username',
    // creatorId: 'id',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: meta.site.description
      }
    ]
  },
  keywords: meta.site.keywords,
  creator: meta.author.username,
  openGraph: {
    url: meta.site.url,
    type: 'website',
    title: meta.site.title,
    siteName: meta.site.title,
    description: meta.site.description,
    locale: 'en-US',
    images: [
      {
        url: meta.site.ogImage,
        width: 1200,
        height: 630,
        alt: meta.site.description,
        type: 'image/png'
      }
    ]
  },
  icons: {
    icon: '/favicon/favicon.svg',
    shortcut: '/favicon/favicon.svg',
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png'
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.className} ${archivo.variable} ${newsreader.variable}`}>
        {children}
      </body>
    </html>
  );
}
