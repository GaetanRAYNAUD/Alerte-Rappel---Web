import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import fr from '~/i18n/messages/fr.json';
import { useGetLatestAlertesQuery } from '~/store/alertesApi';
import { AlerteCard } from '~/components/AlerteCard';

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

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
        { data?.content.map((alerte) => (
          <AlerteCard key={ alerte.alertNumber } alerte={ alerte }/>
        )) }
      </Box>

      { data && data.totalPages > 1 && (
        <Box sx={ { display: 'flex', justifyContent: 'center', mt: 3 } }>
          <Pagination
            count={ data.totalPages }
            page={ page + 1 }
            onChange={ (_, value) => setPage(value - 1) }
            color="primary"
          />
        </Box>
      ) }
    </Box>
  );
}
