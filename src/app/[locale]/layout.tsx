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
      <body className={`${inter.className} animated-gradient`}>
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