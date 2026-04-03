import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router';
import { AlerteList } from '~/components/AlerteList';
import { SearchBar } from '~/components/SearchBar/SearchBar';
import { useNavigateToRecherche } from '~/hooks/useNavigateToRecherche';
import fr from '~/i18n/messages/fr.json';
import { useSearchAlertesQuery } from '~/store/alertesApi';

export function meta() {
  return [
    { title: `${fr['search.title']} — ${fr['app.title']}` }
  ];
}

export default function Recherche() {
  const intl = useIntl();
  const [searchParams, setSearchParams] = useSearchParams();
  const { navigateToRecherche } = useNavigateToRecherche();
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '0');

  const { data, isLoading, isFetching } = useSearchAlertesQuery(
    { q: query, page },
    { skip: !query, refetchOnMountOrArgChange: true }
  );

  const handlePageChange = (_: unknown, value: number) => {
    setSearchParams({ q: query, page: String(value - 1) });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={ { fontWeight: 'bold' } }>
        { intl.formatMessage({ id: 'search.title' }) }
        { query && (
          <Typography component="span" variant="h4" color="text.secondary" sx={{ ml: 1 }}>
            : {query}
          </Typography>
        ) }
      </Typography>

      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}>
        <SearchBar onSearch={navigateToRecherche} />
      </Box>

      { !query ? (
        <Typography color="text.secondary">
          { intl.formatMessage({ id: 'search.hint' }) }
        </Typography>
      ) : (
        <>
          { isFetching && <LinearProgress sx={ { mb: 2 } }/> }

          <AlerteList
            data={data}
            isFetching={isFetching}
            page={page}
            onPageChange={(p) => setSearchParams({ q: query, page: String(p) })}
          />
        </>
      ) }
    </Box>
  );
}
