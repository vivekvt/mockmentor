import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { appConfig } from '@/lib/appConfig';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
  // openGraph: {
  //   title: `${appConfig.title}`,
  //   description: appConfig.description,
  //   images: appConfig.coverImage,
  //   siteName: `${appConfig.title}`,
  //   locale: 'en_US',
  //   type: 'website',
  // },
  // twitter: {
  //   title: `${appConfig.title}`,
  //   card: 'summary_large_image',
  //   description: appConfig.description,
  //   images: [appConfig.coverImage],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
