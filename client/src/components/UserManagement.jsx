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
} from "@mui/material"

function UserManagement() {
  const [users, setUsers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchDepartments()
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

  const handleEdit = (user) => {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedUser(null)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const userData = Object.fromEntries(formData.entries())

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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.employee_id}>
                <TableCell>{user.employee_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department_name}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
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
              label="Name"
              name="employee_name"
              margin="normal"
              defaultValue={selectedUser?.employee_name}
            />
            <TextField fullWidth label="Email" name="email" margin="normal" defaultValue={selectedUser?.email} />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select name="role" defaultValue={selectedUser?.role || ""}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Employee">Manager</MenuItem>
                <MenuItem value="Employee">Owner</MenuItem>

              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select name="department_id" defaultValue={selectedUser?.department_id || ""}>
                {departments.map((dept) => (
                  <MenuItem key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select name="status" defaultValue={selectedUser?.status || "Active"}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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
    </Box>
  )
}

export default UserManagement

