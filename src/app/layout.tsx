import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Script from 'next/script';
import CheckSession from '@/components/auth/CheckSession';
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload dark mode class to prevent hydration mismatch */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const theme = localStorage.getItem('theme') || 'light';
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <CheckSession />   {/* <-- session checker */}

        {/* Load external scripts client-side only */}
        <Script
          src="https://cdn.jsdelivr.net/npm/simple-datatables@9.0.3"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
