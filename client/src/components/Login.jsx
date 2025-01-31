import { useState } from "react"
import { Box, Button, TextField, Typography, Paper, Fade, Grow, Avatar } from "@mui/material"
import { keyframes } from "@mui/system"
import axios from "axios"
import PersonIcon from "@mui/icons-material/Person"

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(83, 105, 248, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(83, 105, 248, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(83, 105, 248, 0);
  }
`

function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      console.log("API URL:", import.meta.env.VITE_API_URL)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password })
      if (response.data.success) {
        onLogin(response.data.role)
      } else {
        setError("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    }
  }

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f9fc",
          p: 2,
          animation: `${fadeIn} 1s ease-out`,
        }}
      >
        <Grow in={true} timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
              overflow: "hidden",
              p: 4,
              animation: `${slideUp} 0.5s ease-out`,
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(83, 105, 248, 0.2)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#5369f8",
                  animation: `${pulse} 2s infinite`,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
            </Box>

            <Typography
              variant="h5"
              sx={{
                color: "#5369f8",
                fontWeight: "bold",
                mb: 3,
                textAlign: "center",
                animation: `${fadeIn} 1s ease-out 0.5s both`,
              }}
            >
              Login
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, textAlign: "center", animation: `${fadeIn} 1s ease-out 0.7s both` }}>
              Welcome back!
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
                textAlign: "center",
                animation: `${fadeIn} 1s ease-out 0.9s both`,
              }}
            >
              Enter your username and password to access Adinath Dashboard.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  mb: 2,
                  animation: `${fadeIn} 0.8s ease-out 1.0s both`,
                  "& .MuiOutlinedInput-root": {
                    transition: "border-color 0.3s ease-in-out",
                    "&:hover fieldset": {
                      borderColor: "#5369f8",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 3,
                  animation: `${fadeIn} 1s ease-out 1.3s both`,
                  "& .MuiOutlinedInput-root": {
                    transition: "border-color 0.3s ease-in-out",
                    "&:hover fieldset": {
                      borderColor: "#5369f8",
                    },
                  },
                }}
              />
              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, animation: `${fadeIn} 1s ease-out 1.0s both` }}>
                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    bgcolor: "#5369f8",
                    color: "white",
                    py: 1,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      bgcolor: "#4559e8",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(83, 105, 248, 0.4)",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </form>
          </Paper>
        </Grow>
      </Box>
    </Fade>
  )
}

export default Login

