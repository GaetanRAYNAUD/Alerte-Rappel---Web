import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useMemo, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { ThemeModeContext } from '~/hooks/useThemeMode';
import { MainLayout } from '~/components/Layout/MainLayout';
import { AppIntlProvider } from '~/i18n/IntlProvider';
import { store } from '~/store';
import type { ThemeMode } from '~/utils/storage';
import { getThemeMode, saveThemeMode } from '~/utils/storage';

import type { Route } from './+types/root';

function useAppTheme(mode: ThemeMode) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark);

  return useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#1565c0'
      },
      secondary: {
        main: '#f9a825'
      }
    },
    typography: {
      fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif'
    }
  }), [isDark]);
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [mode, _setMode] = useState<ThemeMode>(getThemeMode);
  const setMode = useCallback((m: ThemeMode) => {
    _setMode(m);
    saveThemeMode(m);
  }, []);
  const theme = useAppTheme(mode);

  return (
    <ReduxProvider store={store}>
      <AppIntlProvider>
        <ThemeModeContext.Provider value={{ mode, setMode }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ThemeProvider>
        </ThemeModeContext.Provider>
      </AppIntlProvider>
    </ReduxProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'Une erreur inattendue est survenue.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Erreur';
    details =
      error.status === 404
        ? 'La page demandée est introuvable.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ overflow: 'auto', padding: '1rem' }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
