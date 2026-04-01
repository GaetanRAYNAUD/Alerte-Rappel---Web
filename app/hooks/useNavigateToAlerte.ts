import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useLazyGetAlerteByCodeBarresQuery } from '~/store/alertesApi';

export function useNavigateToAlerte() {
  const navigate = useNavigate();
  const [triggerSearch] = useLazyGetAlerteByCodeBarresQuery();

  const navigateByBarcode = useCallback(async (code: string) => {
    const { data: alerte } = await triggerSearch(code);
    if (alerte) {
      navigate(`/alerte/${alerte.alertNumber}`);
    }
  }, [navigate, triggerSearch]);

  const navigateById = useCallback((id: string) => {
    navigate(`/alerte/${id}`);
  }, [navigate]);

  return { navigateByBarcode, navigateById };
}
