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
  if (sarees.length === 0) {
    return <Typography sx={{ mt: 4 }}>No sarees yet. Add one to get started.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
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
                <Avatar src={saree.imageUrl} variant="rounded" alt={saree.name} />
              </TableCell>
              <TableCell>{saree.name}</TableCell>
              <TableCell sx={{ maxWidth: 240 }}>{saree.description}</TableCell>
              <TableCell align="right">{saree.originalPrice.toFixed(2)}</TableCell>
              <TableCell align="right">{saree.exchangeRate}</TableCell>
              <TableCell align="right">{saree.additionalCharges.toFixed(2)}</TableCell>
              <TableCell align="right">{saree.marginPercentage}</TableCell>
              <TableCell align="right">
                <strong>{saree.finalPrice.toFixed(2)}</strong>
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
    </TableContainer>
  );
}
