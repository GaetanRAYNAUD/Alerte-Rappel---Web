import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import type { Alert } from '~/store/alertesApi';

interface AlerteRecallDialogProps {
  alerte: Alert | null;
  onClose: () => void;
}

export function AlerteRecallDialog({ alerte, onClose }: AlerteRecallDialogProps) {
  const intl = useIntl();
  const navigate = useNavigate();

  if (!alerte) {
    return null;
  }

  const photo = alerte.media?.photos?.[0];
  const name = alerte.product?.specificName;
  const brand = alerte.product?.brand;
  const reason = alerte.riskDescription;

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <WarningAmberIcon color="warning" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h6" color="warning.main" gutterBottom sx={{ fontWeight: 700 }}>
          {intl.formatMessage({ id: 'recall.dialog.title' })}
        </Typography>

        {photo && (
          <Box
            component="img"
            src={photo}
            alt={name ?? ''}
            sx={{
              width: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 2,
              my: 2
            }}
          />
        )}

        {name && (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {name}
          </Typography>
        )}

        {brand && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {brand}
          </Typography>
        )}

        {reason && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {reason}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            onClose();
            navigate(`/alerte/${alerte.alertNumber}`);
          }}
        >
          {intl.formatMessage({ id: 'recall.dialog.details' })}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
