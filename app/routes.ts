import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('alertes', 'routes/alertes-recentes.tsx'),
  route('recherche', 'routes/recherche.tsx'),
  route('alerte/*', 'routes/alerte-detail.tsx'),
  route('comment-ca-marche', 'routes/comment-ca-marche.tsx'),
  route('faq', 'routes/faq.tsx'),
  route('mentions-legales', 'routes/mentions-legales.tsx'),
  route('contact', 'routes/contact.tsx')
] satisfies RouteConfig;
