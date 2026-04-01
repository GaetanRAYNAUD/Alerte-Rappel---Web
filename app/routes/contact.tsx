import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import fr from '~/i18n/messages/fr.json';

export function meta() {
  return [
    { title: `${fr['page.contact.title']} — ${fr['app.title']}` }
  ];
}

export default function Contact() {
  const intl = useIntl();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {intl.formatMessage({ id: 'page.contact.title' })}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          {intl.formatMessage({ id: 'page.contact.content' })}
        </Typography>
      </Paper>
    </Box>
  );
}
