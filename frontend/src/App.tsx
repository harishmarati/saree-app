import { useEffect, useMemo, useState } from 'react';
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
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
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

  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === '' ? null : Number(minPrice);
    const max = maxPrice === '' ? null : Number(maxPrice);
    return items.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
      if (min !== null && Number.isFinite(min) && s.finalPrice < min) return false;
      if (max !== null && Number.isFinite(max) && s.finalPrice > max) return false;
      return true;
    });
  }, [items, query, minPrice, maxPrice]);

  const isFiltering = query.trim() !== '' || minPrice !== '' || maxPrice !== '';

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
            {isFiltering ? `${filteredItems.length} of ${items.length}` : items.length} saree
            {(isFiltering ? filteredItems.length : items.length) === 1 ? '' : 's'}
            {isFiltering ? ' match' : ' in your collection'}
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Saree
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search name or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            size="small"
            type="number"
            label="Price above (>)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: { sm: 160 } }}
          />
          <TextField
            size="small"
            type="number"
            label="Price below (<)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: { sm: 160 } }}
          />
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
          <SareeTable sarees={filteredItems} onEdit={handleEditClick} onDelete={handleDeleteClick} />
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
