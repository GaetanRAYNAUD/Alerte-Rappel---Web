import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import { Link } from 'react-router';
import { type Alert } from '~/store/alertesApi';
import { AlerteCard } from './AlerteCard';

interface AlerteListProps {
  data?: {
    content: Alert[];
    totalElements: number;
    totalPages: number;
  };
  isFetching?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
}

export function AlerteList({ data, isFetching, page = 0, onPageChange }: AlerteListProps) {
  const intl = useIntl();

  if (!data || data.content.length === 0) {
    return null;
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {intl.formatMessage({ id: 'search.resultsCount' }, { count: data.totalElements })}
      </Typography>

      <List sx={{ p: 0, opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {data.content.map((alerte) => (
          <ListItem key={alerte.alertNumber} disableGutters sx={{ mb: 1, display: 'block' }}>
            <ListItemButton
              component={Link}
              to={`/alerte/${alerte.alertNumber}`}
              sx={{
                p: 0,
                borderRadius: 1,
                transition: 'background-color 0.2s, box-shadow 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  '& .MuiCard-root': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => theme.shadows[2]
                  }
                }
              }}
            >
              <AlerteCard alerte={alerte} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {data.totalPages > 1 && onPageChange && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={data.totalPages}
            page={page + 1}
            onChange={(_, value) => onPageChange(value - 1)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}
