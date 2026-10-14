import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadSarees, addSaree, editSaree, removeSaree } from './features/sarees/sareesSlice';
import { checkSession, logout } from './features/auth/authSlice';
import { SareeTable } from './components/SareeTable';
import { SareeFormDialog } from './components/SareeFormDialog';
import { LoginPage } from './components/LoginPage';
import type { Saree, SareeInput } from './features/sarees/types';

function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((state) => state.auth.status);
  const { items, status, error } = useAppSelector((state) => state.sarees);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | null>(null);

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      dispatch(loadSarees());
    }
  }, [authStatus, dispatch]);

  if (authStatus === 'checking') {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <LoginPage />;
  }

  function handleAddClick() {
    setEditingSaree(null);
    setDialogOpen(true);
  }

  function handleEditClick(saree: Saree) {
    setEditingSaree(saree);
    setDialogOpen(true);
  }

  function handleDeleteClick(saree: Saree) {
    if (window.confirm(`Delete "${saree.name}"?`)) {
      dispatch(removeSaree(saree.id));
    }
  }

  function handleSubmit(input: SareeInput) {
    if (editingSaree) {
      dispatch(editSaree({ id: editingSaree.id, input }));
    } else {
      dispatch(addSaree(input));
    }
    setDialogOpen(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 36, height: 36, mr: 1.5 }}>
            <DiamondIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif" }}>
            Saree Inventory
          </Typography>
          <Button
            variant="outlined"
            onClick={() => dispatch(logout())}
            sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'inherit', '&:hover': { borderColor: 'white' } }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {items.length} saree{items.length === 1 ? '' : 's'} in your collection
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Saree
          </Button>
        </Stack>

        {status === 'loading' && (
          <Stack sx={{ alignItems: 'center', mt: 4 }}>
            <CircularProgress />
          </Stack>
        )}

        {status === 'failed' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error ?? 'Failed to load sarees'}
          </Alert>
        )}

        {status === 'succeeded' && (
          <SareeTable sarees={items} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        )}

        <SareeFormDialog
          open={dialogOpen}
          saree={editingSaree}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmit}
        />
      </Container>
    </Box>
  );
}

export default App;
