import './globals.css';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resumepilot.ai';

export const metadata: Metadata = {
  title: 'ResumePilot.ai - AI-Powered CV & Cover Letter Generator',
  description: 'Generate professional CVs and cover letters in seconds with AI. ATS-optimized, customizable, and ready to download.',
  metadataBase: new URL(appUrl),
  keywords: ['CV generator', 'resume builder', 'cover letter', 'AI CV', 'ATS optimization', 'job application', 'career tools'],
  authors: [{ name: 'ResumePilot.ai' }],
  openGraph: {
    title: 'ResumePilot.ai - AI-Powered CV & Cover Letter Generator',
    description: 'Generate professional CVs and cover letters in seconds with AI. ATS-optimized, customizable, and ready to download.',
    url: appUrl,
    siteName: 'ResumePilot.ai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumePilot.ai - AI-Powered CV & Cover Letter Generator',
    description: 'Generate professional CVs and cover letters in seconds with AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sghQbcuLftkkgzypxn-im4yjlxVLpFSS_4ChdcveR54',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
