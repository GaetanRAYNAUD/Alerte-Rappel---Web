import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import fr from '~/i18n/messages/fr.json';

export function meta() {
  return [
    { title: `${fr['page.faq.title']} — ${fr['app.title']}` }
  ];
}

const faqItems = [
  { q: 'page.faq.q1', a: 'page.faq.a1' },
  { q: 'page.faq.q2', a: 'page.faq.a2' },
  { q: 'page.faq.q3', a: 'page.faq.a3' },
  { q: 'page.faq.q4', a: 'page.faq.a4' }
];

export default function FAQ() {
  const intl = useIntl();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <HelpOutlineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {intl.formatMessage({ id: 'page.faq.title' })}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {faqItems.map(({ q, a }) => (
          <Accordion
            key={q}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '12px !important',
              '&::before': { display: 'none' },
              overflow: 'hidden'
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {intl.formatMessage({ id: q })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7, '& a': { color: 'primary.main' } }}
                dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: a }) }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
