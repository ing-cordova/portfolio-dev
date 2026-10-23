import { notFound } from 'next/navigation';
import { Manrope, Instrument_Serif } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { IntlProvider } from '../../components/IntlProvider';
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: '--font-sans' });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: '400', style: ['normal', 'italic'], variable: '--font-editorial' });

const siteMetadata = {
  title: "Andrés Córdova — Software & AI Engineer",
  description: "Ingeniería de software con intención. Productos digitales, sistemas empresariales y experiencias con inteligencia artificial por Andrés Córdova.",
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    ...siteMetadata,
    description: locale === 'en'
      ? 'Software engineering with intention. Digital products, business systems, and AI experiences by Andrés Córdova.'
      : siteMetadata.description,
  };
}

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
        <link rel="icon" href="/sparkle.ico" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/sparkle.ico" />
        <meta name="theme-color" content="#0c101e" />
      </head>
      <body className={`${manrope.variable} ${instrument.variable} ${manrope.className}`}>
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
