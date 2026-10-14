import { useEffect, useState } from 'react';
import { Container, Typography, Button, Stack, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadSarees, addSaree, editSaree, removeSaree } from './features/sarees/sareesSlice';
import { SareeTable } from './components/SareeTable';
import { SareeFormDialog } from './components/SareeFormDialog';
import type { Saree, SareeInput } from './features/sarees/types';

function App() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.sarees);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | null>(null);

  useEffect(() => {
    dispatch(loadSarees());
  }, [dispatch]);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Saree Inventory
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
  );
}

export default App;
