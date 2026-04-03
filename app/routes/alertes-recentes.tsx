import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { AlerteList } from '~/components/AlerteList';
import fr from '~/i18n/messages/fr.json';
import { useGetLatestAlertesQuery } from '~/store/alertesApi';

export function meta() {
  return [
    { title: `${fr['alerte.dernieres']} — ${fr['app.title']}` }
  ];
}

export default function AlertesRecentes() {
  const intl = useIntl();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetLatestAlertesQuery(page);

  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 4 } }>
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={ { fontWeight: 'bold' } }>
        { intl.formatMessage({ id: 'alerte.dernieres' }) }
      </Typography>

      <AlerteList
        data={data}
        page={page}
        onPageChange={setPage}
      />
    </Box>
  );
}
