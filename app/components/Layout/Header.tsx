import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useSearchParams } from 'react-router';
import { SearchBar } from '~/components/SearchBar/SearchBar';
import { useNavigateToRecherche } from '~/hooks/useNavigateToRecherche';

const navItems = [
  { labelId: 'nav.howItWorks', path: '/comment-ca-marche' },
  { labelId: 'nav.faq', path: '/faq' },
  { labelId: 'nav.contact', path: '/contact' }
] as const;

export function Header() {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { navigateToRecherche } = useNavigateToRecherche();

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', whiteSpace: 'nowrap', zIndex: 1 }}
          >
            {intl.formatMessage({ id: 'app.title' })}
          </Typography>

          <Button
            component={Link}
            to="/alertes"
            color="inherit"
            size="small"
            sx={{ display: { xs: 'none', md: 'flex' }, whiteSpace: 'nowrap', ml: 2, zIndex: 1 }}
          >
            {intl.formatMessage({ id: 'nav.alertes' })}
          </Button>

          <Box sx={{
            position: { xs: 'static', md: 'absolute' },
            left: '50%',
            transform: { xs: 'none', md: 'translateX(-50%)' },
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center',
            width: { xs: 'auto', sm: '40%', md: '30%' },
            minWidth: 150,
            maxWidth: 600,
            zIndex: 0,
            mx: { xs: 2, md: 0 }
          }}>
            <Box sx={{ width: '100%' }}>
              <SearchBar onSearch={navigateToRecherche} defaultValue={query} />
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, zIndex: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                size="small"
              >
                {intl.formatMessage({ id: item.labelId })}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: 250, p: 2 }} onClick={() => setDrawerOpen(false)}>
          <Box sx={{ mb: 2 }} onClick={(e) => e.stopPropagation()}>
            <SearchBar onSearch={(query) => {
              setDrawerOpen(false);
              navigateToRecherche(query);
            }} defaultValue={query} />
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemText primary={intl.formatMessage({ id: 'nav.home' })} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/alertes">
                <ListItemText primary={intl.formatMessage({ id: 'nav.alertes' })} />
              </ListItemButton>
            </ListItem>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemText primary={intl.formatMessage({ id: item.labelId })} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
