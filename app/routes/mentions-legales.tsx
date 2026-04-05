import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import fr from '~/i18n/messages/fr.json';

export function meta() {
  return [
    { title: `${fr['page.legal.title']} — ${fr['app.title']}` }
  ];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function MentionsLegales() {
  const intl = useIntl();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {intl.formatMessage({ id: 'page.legal.title' })}
      </Typography>

      <Section title="Éditeur du site">
        <Typography variant="body1" paragraph>
          Le site <strong>Alerte Rappel</strong> est un projet personnel à but non commercial,
          édité par Gaétan RAYNAUD.
        </Typography>
        <Typography variant="body1">
          Contact : <Link href="mailto:contact@alerte-rappel.gaetanraynaud.fr">
            contact@alerte-rappel.gaetanraynaud.fr
          </Link>
        </Typography>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Hébergement">
        <Typography variant="body1" paragraph>
          Le site est hébergé par{' '}
          <Link href="https://zap-hosting.com/en/" target="_blank" rel="noopener noreferrer">
            ZAP-Hosting
          </Link>{' '}
          — ZAP-Hosting GmbH & Co. KG, Hafenweg 8, 48155 Münster, Allemagne.
        </Typography>
        <Typography variant="body1">
          Le trafic transite par{' '}
          <Link href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
            Cloudflare, Inc.
          </Link>{' '}
          (101 Townsend St, San Francisco, CA 94107, États-Unis),
          qui assure la protection et l'optimisation du site. Cloudflare peut être amené
          à traiter temporairement certaines données techniques (adresse IP, en-têtes HTTP)
          dans le cadre de ce service.
        </Typography>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Sources des données">
        <Typography variant="body1" paragraph>
          Les données de rappel produit affichées sur ce site ne sont pas produites par
          l'éditeur. Elles proviennent exclusivement de deux sources officielles et publiques :
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1">
              <Link href="https://rappelconso.beta.gouv.fr/" target="_blank" rel="noopener noreferrer">
                RappelConso
              </Link>{' '}
              — site officiel du gouvernement français répertoriant les rappels de produits
              de consommation sur le marché français.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <Link href="https://ec.europa.eu/safety-gate/" target="_blank" rel="noopener noreferrer">
                Safety Gate (RAPEX)
              </Link>{' '}
              — système d'alerte rapide de l'Union européenne pour les produits
              dangereux non alimentaires.
            </Typography>
          </li>
        </Box>
        <Typography variant="body1" paragraph>
          L'éditeur ne garantit ni l'exhaustivité ni l'exactitude de ces données.
          En cas de doute sur un produit, veuillez consulter directement les sources officielles
          mentionnées ci-dessus.
        </Typography>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Propriété intellectuelle">
        <Typography variant="body1" paragraph>
          Les marques, logos et images de produits affichés sur ce site appartiennent à leurs
          propriétaires respectifs et sont reproduits uniquement à des fins d'information
          dans le cadre du signalement de rappels produit.
        </Typography>
        <Typography variant="body1">
          Le code source de l'application est la propriété de l'éditeur.
        </Typography>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Responsabilité">
        <Typography variant="body1" paragraph>
          Ce site est fourni à titre informatif uniquement. L'éditeur ne saurait être tenu
          responsable des dommages directs ou indirects résultant de l'utilisation des
          informations présentes sur ce site.
        </Typography>
        <Typography variant="body1">
          Les informations de rappel sont mises à jour régulièrement mais peuvent présenter
          un décalage par rapport aux sources officielles.
        </Typography>
      </Section>

      <Divider sx={{ my: 3 }} />

      <Section title="Données personnelles">
        <Typography variant="body1" paragraph>
          Ce site ne collecte aucune donnée personnelle. L'historique de recherche et de
          consultation est stocké uniquement dans le navigateur de l'utilisateur
          (localStorage) et n'est transmis à aucun serveur.
        </Typography>
        <Typography variant="body1">
          Aucun cookie publicitaire ou de suivi n'est utilisé.
        </Typography>
      </Section>
    </Container>
  );
}
