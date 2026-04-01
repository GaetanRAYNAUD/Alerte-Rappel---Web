import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import fr from '~/i18n/messages/fr.json';

export function meta() {
  return [
    { title: `${fr['page.howItWorks.title']} — ${fr['app.title']}` }
  ];
}

export default function CommentCaMarche() {
  const intl = useIntl();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {intl.formatMessage({ id: 'page.howItWorks.title' })}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {(['step1', 'step2', 'step3'] as const).map((step) => (
          <Typography key={step} variant="body1" sx={{ mb: 2 }}>
            {intl.formatMessage({ id: `page.howItWorks.${step}` })}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}
