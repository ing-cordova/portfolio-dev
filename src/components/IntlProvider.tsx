'use client';

import React, { createContext, useContext } from 'react';

type Messages = Record<string, unknown>;

interface IntlContextType {
  locale: string;
  messages: Messages;
  t: (key: string) => string;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

interface IntlProviderProps {
  locale: string;
  messages: Messages;
  children: React.ReactNode;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <IntlContext.Provider value={{ locale, messages, t }}>
      {children}
    </IntlContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error('useTranslations must be used within an IntlProvider');
  }

  const { t: originalT, messages } = context;

  const t = (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return originalT(fullKey);
  };

  // Función para obtener datos raw (objetos/arrays)
  t.raw = (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const keys = fullKey.split('.');
    let value: unknown = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  };

  return t;
}