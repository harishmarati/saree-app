import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import type { Saree, SareeInput } from '../features/sarees/types';
import { calculateFinalPrice } from '../features/sarees/pricing';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '../features/sarees/cloudinary';

const emptyForm: SareeInput = {
  name: '',
  description: '',
  imageUrl: '',
  originalPrice: 0,
  exchangeRate: 1,
  additionalCharges: 0,
  marginPercentage: 0,
};

interface SareeFormDialogProps {
  open: boolean;
  saree: Saree | null;
  onClose: () => void;
  onSubmit: (input: SareeInput) => void;
}

export function SareeFormDialog({ open, saree, onClose, onSubmit }: SareeFormDialogProps) {
  const [form, setForm] = useState<SareeInput>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (saree) {
      const { id: _id, finalPrice: _finalPrice, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = saree;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
    setUploadError(null);
  }, [saree, open]);

  const previewFinalPrice = calculateFinalPrice(
    form.originalPrice,
    form.exchangeRate,
    form.additionalCharges,
    form.marginPercentage
  );

  const isValid = form.name.trim().length > 0;

  function handleChange<K extends keyof SareeInput>(key: K, value: SareeInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      handleChange('imageUrl', url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    if (!isValid) return;
    onSubmit(form);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{saree ? 'Edit Saree' : 'Add Saree'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Saree Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar src={form.imageUrl} variant="rounded" sx={{ width: 56, height: 56 }} />
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              fullWidth
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
              disabled={!isCloudinaryConfigured || uploading}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Upload
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  void handleFileSelected(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </Button>
          </Stack>
          {!isCloudinaryConfigured && (
            <Typography variant="caption" color="text.secondary">
              Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable image upload.
            </Typography>
          )}
          {uploadError && <Alert severity="error">{uploadError}</Alert>}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Original Price (₹)"
              type="number"
              value={form.originalPrice}
              onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Exchange Rate (₹ per A$)"
              type="number"
              value={form.exchangeRate}
              onChange={(e) => handleChange('exchangeRate', Number(e.target.value))}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Additional Charges (₹)"
              type="number"
              value={form.additionalCharges}
              onChange={(e) => handleChange('additionalCharges', Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Margin (%)"
              type="number"
              value={form.marginPercentage}
              onChange={(e) => handleChange('marginPercentage', Number(e.target.value))}
              fullWidth
            />
          </Stack>
          <Typography variant="subtitle1">
            Final Price: A${previewFinalPrice.toFixed(2)}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          {saree ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
