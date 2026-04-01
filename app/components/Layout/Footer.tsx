import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import { Link as RouterLink } from 'react-router';

export function Footer() {
  const intl = useIntl();

  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 1, flexWrap: 'wrap' }}>
          <Link component={RouterLink} to="/mentions-legales" color="text.secondary" underline="hover">
            {intl.formatMessage({ id: 'nav.legal' })}
          </Link>
          <Link component={RouterLink} to="/faq" color="text.secondary" underline="hover">
            {intl.formatMessage({ id: 'nav.faq' })}
          </Link>
          <Link component={RouterLink} to="/contact" color="text.secondary" underline="hover">
            {intl.formatMessage({ id: 'nav.contact' })}
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {intl.formatMessage({ id: 'footer.text' })}
        </Typography>
      </Container>
    </Box>
  );
}
