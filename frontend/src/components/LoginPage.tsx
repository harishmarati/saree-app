import { useState, type FormEvent } from 'react';
import { Container, Paper, TextField, Button, Typography, Stack, Alert } from '@mui/material';
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
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 4, width: '100%' }}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1">
            Saree Inventory
          </Typography>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            fullWidth
          />
          {loginError && <Alert severity="error">{loginError}</Alert>}
          <Button type="submit" variant="contained" disabled={loginPending || !password} fullWidth>
            {loginPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
