import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
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
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {intl.formatMessage({ id: 'page.faq.title' })}
      </Typography>
      {faqItems.map(({ q, a }) => (
        <Accordion key={q}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {intl.formatMessage({ id: q })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: a }) }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
