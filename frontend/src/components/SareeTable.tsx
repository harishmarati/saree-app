import { useState } from 'react';
import {
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Saree } from '../features/sarees/types';

interface SareeTableProps {
  sarees: Saree[];
  onEdit: (saree: Saree) => void;
  onDelete: (saree: Saree) => void;
}

export function SareeTable({ sarees, onEdit, onDelete }: SareeTableProps) {
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  if (sarees.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{ mt: 2, py: 8, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}
      >
        <Typography color="text.secondary">No sarees yet. Add one to get started.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ mt: 2, borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, bgcolor: 'background.default' } }}>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Original Price</TableCell>
            <TableCell align="right">Exchange Rate</TableCell>
            <TableCell align="right">Additional Charges</TableCell>
            <TableCell align="right">Margin (%)</TableCell>
            <TableCell align="right">Final Price</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sarees.map((saree) => (
            <TableRow key={saree.id} hover>
              <TableCell>
                <Avatar
                  src={saree.imageUrl}
                  variant="rounded"
                  alt={saree.name}
                  onClick={() => saree.imageUrl && setPreviewImage({ url: saree.imageUrl, name: saree.name })}
                  sx={{ cursor: saree.imageUrl ? 'pointer' : 'default' }}
                />
              </TableCell>
              <TableCell>{saree.name}</TableCell>
              <TableCell sx={{ maxWidth: 240 }}>{saree.description}</TableCell>
              <TableCell align="right">{saree.originalPrice.toFixed(2)}</TableCell>
              <TableCell align="right">{saree.exchangeRate}</TableCell>
              <TableCell align="right">{saree.additionalCharges.toFixed(2)}</TableCell>
              <TableCell align="right">{saree.marginPercentage}</TableCell>
              <TableCell align="right">
                <Typography component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {saree.finalPrice.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>{new Date(saree.updatedAt).toLocaleString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(saree)} aria-label="edit">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(saree)} aria-label="delete">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={previewImage !== null} onClose={() => setPreviewImage(null)} maxWidth="md">
        {previewImage && (
          <img
            src={previewImage.url}
            alt={previewImage.name}
            style={{ display: 'block', maxWidth: '100%', maxHeight: '85vh' }}
          />
        )}
      </Dialog>
    </TableContainer>
  );
}
