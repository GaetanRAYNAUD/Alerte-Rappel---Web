import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { AlerteList } from '~/components/AlerteList';
import { type Alert } from '~/store/alertesApi';
import { getViewedAlerts, removeViewedAlert } from '~/utils/storage';

export default function Historique() {
  const intl = useIntl();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(getViewedAlerts().map((h) => h.alerte));
  }, []);

  const handleRemove = useCallback((alertNumber: string) => {
    removeViewedAlert(alertNumber);
    setAlerts((prev) => prev.filter((a) => a.alertNumber !== alertNumber));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {intl.formatMessage({ id: 'page.historique.title' })}
      </Typography>
      {alerts.length > 0 ? (
        <AlerteList data={{ content: alerts }} onRemove={handleRemove}/>
      ) : (
        <Typography>{intl.formatMessage({ id: 'page.historique.empty' })}</Typography>
      )}
    </Box>
  );
}
