import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Fade, Grow } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
`;

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
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f6f9fc',
          p: 2,
          animation: `${fadeIn} 1s ease-out`
        }}
      >
        <Grow in={true} timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 2,
              overflow: 'hidden',
              p: 4,
              animation: `${slideUp} 0.5s ease-out`
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#5369f8',
                fontWeight: 'bold',
                mb: 3,
                textAlign: 'center',
                animation: `${fadeIn} 1s ease-out 0.5s both`
              }}
            >
              Login
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', animation: `${fadeIn} 1s ease-out 0.7s both` }}>
              Welcome back!
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                mb: 3,
                textAlign: 'center',
                animation: `${fadeIn} 1s ease-out 0.9s both`
              }}
            >
              Enter your email address and password to access Adinath Dashboard.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email address"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2, animation: `${fadeIn} 0.8s ease-out 1.0s both` }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3, animation: `${fadeIn} 1s ease-out 1.3s both` }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, animation: `${fadeIn} 1s ease-out 1.0s both` }}>
                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    bgcolor: '#5369f8',
                    color: 'white',
                    py: 1,
                    '&:hover': {
                      bgcolor: '#4559e8'
                    },
                    transition: 'background-color 0.2s ease'
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
                },
                animation: `${fadeIn} 1s ease-out 1.0s both`
              }}
            >
              Forgot password?
            </Typography>
          </Paper>
        </Grow>

        <Typography
          sx={{
            mt: 3,
            color: 'text.secondary',
            textAlign: 'center',
            animation: `${fadeIn} 1s ease-out 1.9s both`
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
    </Fade>
  );
}

export default Login;

