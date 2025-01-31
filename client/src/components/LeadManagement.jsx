import React, { useState, useEffect } from "react"
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
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"

function UserManagement() {
  const [users, setUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [departments, setDepartments] = useState([])
  const [userToDelete, setUserToDelete] = useState(null)
  const [managers, setManagers] = useState([])
  const [formErrors, setFormErrors] = useState({})

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
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments`)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/managers`)
      setManagers(response.data)
    } catch (error) {
      console.error("Error fetching managers:", error)
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
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = Object.fromEntries(formData.entries())

    // Form validation
    const errors = {}
    if (!userData.employee_name) errors.employee_name = "Employee name is required"
    if (!userData.phone) errors.phone = "Phone number is required"
    if (!userData.email) errors.email = "Email is required"
    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) errors.email = "Invalid email format"
    if (!userData.department_id) errors.department_id = "Department is required"
    if (!userData.role) errors.role = "Role is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      if (selectedUser) {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${selectedUser.employee_id}`, userData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData)
      }
      fetchUsers()
      handleClose()
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user)
    setOpenDeleteDialog(true)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userToDelete.employee_id}`)
      fetchUsers()
      setOpenDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Employee Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Work Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.employee_id}>
                <TableCell>{user.employee_id}</TableCell>
                <TableCell>{user.employee_name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.work_email}</TableCell>
                <TableCell>{user.department_name}</TableCell>
                <TableCell>{managers.find((m) => m.employee_id === user.manager_id)?.employee_name || "N/A"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmation(user)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              fullWidth
              label="Employee Name"
              name="employee_name"
              margin="normal"
              defaultValue={selectedUser?.employee_name}
              error={!!formErrors.employee_name}
              helperText={formErrors.employee_name}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              margin="normal"
              defaultValue={selectedUser?.phone}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              defaultValue={selectedUser?.email}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField fullWidth label="Address" name="address" margin="normal" defaultValue={selectedUser?.address} />
            <TextField
              fullWidth
              label="Work Email"
              name="work_email"
              margin="normal"
              defaultValue={selectedUser?.work_email}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                name="department_id"
                defaultValue={selectedUser?.department_id || ""}
                error={!!formErrors.department_id}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.department_id && <FormHelperText error>{formErrors.department_id}</FormHelperText>}
            </FormControl>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              defaultValue={selectedUser?.username}
            />
            <TextField fullWidth label="Password" name="password" type="password" margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select name="role" defaultValue={selectedUser?.role || ""} error={!!formErrors.role}>
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="owner">Owner</MenuItem>
              </Select>
              {formErrors.role && <FormHelperText error>{formErrors.role}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select name="status" defaultValue={selectedUser?.status || "Active"}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Manager</InputLabel>
              <Select name="manager_id" defaultValue={selectedUser?.manager_id || ""}>
                <MenuItem value="">None</MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.employee_id} value={manager.employee_id}>
                    {manager.employee_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
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

