import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import { Link } from 'react-router';
import { type Alert } from '~/store/alertesApi';

export function AlerteCard({ alerte }: { alerte: Alert }) {
  const intl = useIntl();
  const photo = alerte.media?.photos?.[0];
  const url = `/alerte/${alerte.alertNumber}`;

  return (
    <Card variant="outlined" component={ Link } to={ url } sx={ { textDecoration: 'none', color: 'inherit' } }>
      <CardActionArea sx={ { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' } }>
        { photo && (
          <Box
            component="img"
            src={ photo }
            alt={ alerte.product?.specificName ?? '' }
            sx={ { width: 120, height: 120, objectFit: 'cover', flexShrink: 0 } }
          />
        ) }
        <CardContent sx={ { flex: 1, py: 1.5 } }>
          <Typography variant="subtitle1" sx={ { fontWeight: 'bold' } } noWrap>
            { alerte.product?.specificName ?? alerte.alertNumber }
          </Typography>
          { alerte.publicationDate && (
            <Typography variant="caption" color="text.secondary">
              { intl.formatDate(alerte.publicationDate, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
            </Typography>
          ) }
          { alerte.product?.brand && (
            <Box sx={ { mt: 0.5 } }>
              <Chip label={ alerte.product.brand } size="small"/>
            </Box>
          ) }
          { alerte.risks && alerte.risks.length > 0 && (
            <Typography variant="body2" color="error" sx={ { mt: 0.5 } } noWrap>
              { intl.formatMessage({ id: 'alerte.risques' }) } : { alerte.risks.join(', ') }
            </Typography>
          ) }
          { alerte.riskDescription && (
            <Typography variant="body2" color="text.secondary" noWrap sx={ { mt: 0.5 } }>
              { intl.formatMessage({ id: 'alerte.motifRappel' }) } : { alerte.riskDescription }
            </Typography>
          ) }
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
