import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { IntlProvider } from '../../components/IntlProvider';
import { Navbar } from '@/components/sections/navbar';
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Andrés Córdova - Full Stack Developer",
  description: "Portafolio profesional de desarrollo web.",
  icons: {
    icon: [
      {
        url: '/sparkle.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/sparkle.ico',
        type: 'image/x-icon',
      }
    ],
    shortcut: '/sparkle.ico',
    apple: '/sparkle.ico'
  }
};

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'es'}];
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate locale
  if (!['en', 'es'].includes(locale)) {
    notFound();
  }
  
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/sparkle.ico" sizes="32x32" />
        <link rel="icon" href="/sparkle-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/sparkle.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}