import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/ui/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>

        {process.env.NODE_ENV === 'production' && (
          <Script
            defer
            src="https://analytics.justdoitvv.site/script.js"
            data-website-id="8afb0102-7abb-4708-a25c-c28660dce2b4"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
