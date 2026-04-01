import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useNavigateToRecherche() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navigateToRecherche = useCallback((query: string) => {
    const search = `?q=${encodeURIComponent(query)}&page=0`;
    if (pathname === '/recherche') {
      navigate(`/recherche${search}`, { replace: true });
    } else {
      navigate(`/recherche${search}`);
    }
  }, [navigate, pathname]);

  return { navigateToRecherche };
}
