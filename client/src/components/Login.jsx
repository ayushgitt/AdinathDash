import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin('Admin');
    } else if (username === 'user' && password === 'user') {
      onLogin('Employee');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f9fc',
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          overflow: 'hidden',
          p: 4
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#5369f8',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Login
        </Typography>

        <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
          Welcome back!
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Enter your email address and password to access admin panel.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              type="submit"
              fullWidth
              sx={{
                bgcolor: '#5369f8',
                color: 'white',
                py: 1,
                '&:hover': {
                  bgcolor: '#4559e8'
                }
              }}
            >
              Login
            </Button>
          </Box>
        </form>
        <Typography
          component="a"
          href="#"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: '#5369f8',
            textDecoration: 'none',
            mt: 2,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Forgot password?
        </Typography>
      </Paper>

      <Typography
        sx={{
          mt: 3,
          color: 'text.secondary',
          textAlign: 'center'
        }}
      >
        Don't have an account?{' '}
        <Typography
          component="a"
          href="#"
          sx={{
            color: '#5369f8',
            textDecoration: 'none',
            ml: 1,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          register
        </Typography>
      </Typography>
    </Box>
  );
}

export default Login;

