import { useState } from "react"
import { Box, Button, TextField, Typography, Paper, Fade, Grow } from "@mui/material"
import { keyframes } from "@mui/system"
import axios from "axios"
import img from "../image/loginlogo.jpeg"
import img2 from "../image/bg.jpeg"

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
    box-shadow: 0 0 0 0 rgba(248,200,79,255);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(254,235,197,255);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(248, 204, 83, 0);
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('https://aadinathtv.com/uploads/banners/59313006WhatsApp%20Image%202022-01-12%20at%202.22.34%20PM%20(1).jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
          zIndex: 0,
        },
      }}
    >
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
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
                backgroundColor: "rgba(249,236,212,255)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(248,200,79,255)",
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
                <Box
                  component="img"
                  src={img}
                  alt="Adinath Logo"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '12px',
                    animation: `${pulse} 2s infinite`,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  color: "#7e1519",
                  fontWeight: "bold",
                  mb: 3,
                  textAlign: "center",
                  animation: `${fadeIn} 1s ease-out 0.5s both`,
                }}
              >
                Login / लॉग इन
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
                        borderColor: "#7e1519",
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
                        borderColor: "#7e1519",
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
                      bgcolor: "#fab63b",
                      color: "white",
                      py: 1,
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        bgcolor: "#ee9121",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(248,200,79,255)",
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
    </Box>
  )
}

export default Login