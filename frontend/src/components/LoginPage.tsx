import { useState, type FormEvent } from 'react';
import { Box, Paper, TextField, Button, Typography, Stack, Alert, Avatar } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { loginPending, loginError } = useAppSelector((state) => state.auth);
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    dispatch(login(password));
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: 'linear-gradient(135deg, #551430 0%, #7A1F3D 55%, #C9972C 100%)',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.35)',
        }}
      >
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <DiamondIcon fontSize="medium" />
          </Avatar>
          <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h1">
              Saree Inventory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your collection
            </Typography>
          </Stack>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            fullWidth
          />
          {loginError && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {loginError}
            </Alert>
          )}
          <Button type="submit" variant="contained" size="large" disabled={loginPending || !password} fullWidth>
            {loginPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
