import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Switch, FormControlLabel } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/')}>
          ImobEddy
        </Typography>
        <Button color="inherit" onClick={() => navigate('/listings')}>
          Imóveis
        </Button>
        <Button color="inherit" onClick={() => navigate('/leads')}>
          Leads
        </Button>
        <Button color="inherit" onClick={() => navigate('/clients')}>
          Clientes
        </Button>
        <Button color="inherit" onClick={() => navigate('/purchase-orders')}>
          Ordens
        </Button>
        <Button color="inherit" onClick={() => navigate('/reports')}>
          Relatórios
        </Button>
        <Button color="inherit" onClick={() => navigate('/settings')}>
          Configurações
        </Button>
        {user ? (
          <>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Olá, {user.email}
            </Typography>
            <Button color="inherit" onClick={signOut}>
              Sair
            </Button>
            <IconButton onClick={toggleTheme} color="inherit">
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Entrar
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;