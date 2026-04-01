# Project Overview

Alerte Rappel is a React Router-based web application designed for alert and notification management. It leverages Material UI (MUI) for styling, Redux Toolkit for state management, and React Intl for internationalization (i18n). The project also incorporates barcode scanning functionality via `@zxing/library`.

## Architecture
- **Framework:** React Router
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Material UI (MUI)
- **Internationalization:** React Intl
- **Build Tool:** Vite

## Building and Running

Ensure you have dependencies installed before running commands:
```bash
npm install
```

### Development
Start the development server with HMR:
```bash
npm run dev
```

### Build
Create a production build:
```bash
npm run build
```

### Deployment
Run the production server:
```bash
npm run start
```

### Maintenance
- **Type Checking:** `npm run typecheck`
- **Linting:** `npm run lint`

## Pages
- `home.tsx`: Page d'accueil
- `alerte-detail.tsx`: Détail d'une alerte
- `alertes-recentes.tsx`: Liste des alertes récentes
- `recherche.tsx`: Page de recherche
- `comment-ca-marche.tsx`: Page explicative
- `contact.tsx`: Page de contact
- `faq.tsx`: Foire aux questions
- `mentions-legales.tsx`: Mentions légales

## Development Conventions

- **Path Aliases:** Use `~/` to import files from the `app/` directory (e.g., `import X from '~/components/X'`).
- **State Management:** Logic should reside in the `app/store/` directory.
- **Internationalization:** Translation messages are located in `app/i18n/messages/`.
- **Components:** UI components are organized within `app/components/`.
- **Routes:** Application routes are defined in `app/routes.ts` and associated files in `app/routes/`.
