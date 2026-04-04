import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router';
import { type Alert } from '~/store/alertesApi';
import { getViewedAlerts } from '~/utils/storage';

import { AlerteCard } from './AlerteCard';

interface AlerteListProps {
  data?: {
    content: Alert[];
    totalElements?: number;
    totalPages?: number;
  };
  isFetching?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  onRemove?: (alertNumber: string) => void;
}

export function AlerteList({ data, isFetching, page = 0, onPageChange, onRemove }: AlerteListProps) {
  const intl = useIntl();
  const list = data?.content ?? [];
  const totalElements = data?.totalElements ?? list.length;

  const viewedMap = useMemo(() => {
    const viewed = getViewedAlerts();
    return new Map(viewed.map((v) => [v.alerte.alertNumber, v.viewedAt]));
  }, [list]);

  if (list.length === 0) {
    return null;
  }

  return (
    <>
      { data?.totalElements != null && (
        <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
          { intl.formatMessage({ id: 'search.resultsCount' }, { count: totalElements }) }
        </Typography>
      ) }

      <List sx={ { p: 0, opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' } }>
        { list.map((alerte) => {
          const viewedAt = viewedMap.get(alerte.alertNumber);

          return (
            <ListItem key={ alerte.alertNumber } disableGutters sx={ { mb: 1, display: 'block' } }>
              <ListItemButton
                component={ Link }
                to={ `/alerte/${ alerte.alertNumber }` }
                sx={ {
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
                } }
              >
                <Box sx={ { width: '100%', position: 'relative' } }>
                  <AlerteCard alerte={ alerte }/>
                  { (viewedAt || onRemove) && (
                    <Box sx={ { position: 'absolute', top: 4, right: 4, display: 'flex', alignItems: 'center', gap: 0.5 } }>
                      { viewedAt && (
                        <Typography variant="caption" color="text.secondary">
                          { intl.formatMessage({ id: 'alerte.viewedAt' }) } { intl.formatDate(viewedAt, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) }
                        </Typography>
                      ) }
                      { onRemove && (
                        <IconButton
                          size="small"
                          onClick={ (e) => { e.preventDefault(); e.stopPropagation(); onRemove(alerte.alertNumber); } }
                          aria-label={ intl.formatMessage({ id: 'historique.remove' }) }
                        >
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                      ) }
                    </Box>
                  ) }
                </Box>
              </ListItemButton>
            </ListItem>
          );
        }) }
      </List>

      { data?.totalPages && data.totalPages > 1 && onPageChange && (
        <Box sx={ { display: 'flex', justifyContent: 'center', mt: 3 } }>
          <Pagination
            count={ data.totalPages }
            page={ page + 1 }
            onChange={ (_, value) => onPageChange(value - 1) }
            color="primary"
          />
        </Box>
      ) }
    </>
  );
}
