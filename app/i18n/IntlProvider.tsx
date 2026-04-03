import { type ReactNode, useState } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

import en from './messages/en.json';
import fr from './messages/fr.json';

type Locale = 'fr' | 'en';

const messages: Record<Locale, Record<string, string>> = { fr, en };

interface AppIntlProviderProps {
  children: ReactNode;
}

export function AppIntlProvider({ children }: AppIntlProviderProps) {
  const [locale] = useState<Locale>('fr');

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale]} defaultLocale="fr">
      {children}
    </ReactIntlProvider>
  );
}
