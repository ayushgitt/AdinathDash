"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Fade,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

// Styled components for custom table elements
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  overflowY: "scroll",
  height: "70vh",
  maxWidth: "100%", // Prevent horizontal scrolling
  "& .MuiTable-root": {
    tableLayout: "fixed", // Fixed table layout to prevent horizontal scrolling
  },
}))

const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px", // Limit cell width
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1", // Background color for table entries
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1", // Ensure odd rows also have the same color
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transition: "background-color 0.2s ease",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#7e1519",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#7e1519",
    "&.Mui-focused": {
      color: "#7e1519",
    },
  },
}))

function UserManagement() {
  const [users, setUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [departments, setDepartments] = useState([])
  const [managers, setManagers] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [showCredentials, setShowCredentials] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("") // State for search term

  useEffect(() => {
    fetchUsers()
    fetchDepartments()
    fetchManagers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      alert("Failed to fetch users. Please try again.")
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments`)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      alert("Failed to fetch departments. Please try again.")
    }
  }

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/managers`)
      console.log(response.data)
      setManagers(response.data)
    } catch (error) {
      console.error("Error fetching managers:", error)
      alert("Failed to fetch managers. Please try again.")
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setFormErrors({})
    setShowCredentials(false)
  }

  const handleSave = async (event) => {
    console.log(1)
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = Object.fromEntries(formData.entries())
    console.log(formData)
    console.log(userData)
    // Form validation
    const errors = {}
    //if (!userData.employee_name) errors.employee_name = "Employee name is required"
    if(!userData.email) errors.email = "Email is required"
    if (!userData.phone) errors.phone = "Phone number is required"
    if (!userData.department_id) errors.department_id = "Department is required"
    if (!userData.role) errors.role = "Role is required"
    //if (!userData.Dedicated_Person) errors.Dedicated_Person = 'Required fields'
    console.log(Object.keys(errors))
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      console.log(selectedUser)
      const response = selectedUser
        ? await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser.employee_id}`, userData)
        : await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData)

      if (response.status === 200 || response.status === 201) {
        await fetchUsers() // Refresh the user list
        handleClose()
      } else {
        throw new Error("Unexpected response status")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with:", error.response.data)
        alert(`Error saving user: ${error.response.data.error || "Unknown error"}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request)
        alert("Error saving user: No response from server")
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message)
        alert(`Error saving user: ${error.message}`)
      }
    }
  }

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user)
    setOpenDeleteDialog(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userToDelete.employee_id}`)
      fetchUsers() // Refresh the user list
      setOpenDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Failed to delete user. Please try again.")
    }
  }

  // Function to get Mandir/Maharaj ji based on department_id
  const getMandirMaharajJi = (departmentId) => {
    const department = departments.find((dept) => dept.department_id === departmentId)
    return department ? department.department_name : "N/A"
  }

  // Function to get Mandir/Maharaj ji based on department_id
  const getDepartments = (departmentId) => {
    const department = departments.find((dept) => dept.department_id === departmentId)
    return department ? department.department_name : "N/A"
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Employee Management</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: "#7e1519",
              "&:hover": {
                backgroundColor: "#fdedd1",
                color: "#7e1519",
              },
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>ID</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Name</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Phone</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Department</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Manager</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Role</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Status</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <StyledTableRow key={user.employee_id}>
                <StyledTableCell>{user.employee_id}</StyledTableCell>
                <StyledTableCell>{user.employee_name}</StyledTableCell>
                <StyledTableCell>{user.phone}</StyledTableCell>
                <StyledTableCell>{getDepartments(user.department_id)}</StyledTableCell>
                <StyledTableCell>
                  {managers.find((m) => m.employee_id === user.manager_id)?.employee_name || "N/A"}
                </StyledTableCell>
                <StyledTableCell>{user.role}</StyledTableCell>
                <StyledTableCell>{user.status}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmation(user)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "80%",
            maxHeight: "90vh",
            m: "auto",
            backgroundColor: "#fdedd1",
          },
        }}
      >
        <DialogTitle>{selectedUser ? "Edit User" : "Add Employee"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Fade in={true} timeout={500}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 3,
                  padding: 3,
                }}
              >
                <StyledTextField
                  label="Employee Name"
                  name="employee_name"
                  defaultValue={selectedUser?.employee_name}
                  error={!!formErrors.employee_name}
                  helperText={formErrors.employee_name}
                />
                <StyledTextField
                  label="Phone (with 91) *"
                  name="phone"
                  defaultValue={selectedUser?.phone}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                />
                <StyledTextField
                  label="Email *"
                  name="email"
                  defaultValue={selectedUser?.email}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
                <StyledTextField label="Address" name="address" defaultValue={selectedUser?.address} />
                <StyledTextField label="Work Email" name="work_email" defaultValue={selectedUser?.work_email} />
                <StyledFormControl>
                  <InputLabel shrink={true}>Department *</InputLabel>
                  <Select
                    name="department_id"
                    defaultValue={selectedUser?.department_id || "NAN"}
                    error={!!formErrors.department_id}
                    label="Department"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.department_id && <FormHelperText error>{formErrors.department_id}</FormHelperText>}
                </StyledFormControl>

                <StyledFormControl>
                  <InputLabel shrink={true}>Role*</InputLabel>
                  <Select
                    name="role"
                    defaultValue={selectedUser?.role || "NAN"}
                    error={!!formErrors.role}
                    label="Role"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                    }}
                  >
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Owner">Owner</MenuItem>
                  </Select>
                  {formErrors.role && <FormHelperText error>{formErrors.role}</FormHelperText>}
                </StyledFormControl>

                <StyledFormControl>
                  <InputLabel shrink={true}>Status</InputLabel>
                  <Select
                    name="status"
                    defaultValue={selectedUser?.status || "Active"}
                    label="Status"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </StyledFormControl>

                <StyledFormControl>
                  <InputLabel shrink={true}>Manager *</InputLabel>
                  <Select
                    name="manager_id"
                    defaultValue={selectedUser?.manager_id || "NAN"}
                    label="Manager"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7e1519",
                      },
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {managers.map((manager) => (
                      <MenuItem key={manager.employee_id} value={manager.employee_id}>
                         {`${manager.employee_id} - ${manager.employee_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>

                <FormControlLabel
                  control={
                    <Checkbox checked={showCredentials} onChange={(e) => setShowCredentials(e.target.checked)} />
                  }
                  label="Add Login Credentials"
                />

                {showCredentials && (
                  <>
                    <StyledTextField label="Username" name="username" defaultValue={selectedUser?.username} />
                    <StyledTextField label="Password" name="password" type="password" />
                  </>
                )}
              </Box>
            </Fade>
          </DialogContent>
          <DialogActions sx={{ padding: 3 }}>
            <Button onClick={handleClose} variant="outlined" size="large">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{ backgroundColor: "#7e1519" }}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the employee: {userToDelete?.employee_name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
