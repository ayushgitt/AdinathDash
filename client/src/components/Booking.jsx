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
} from "@mui/material"

function Booking() {
  const [bookings, setBookings] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`)
      setBookings(response.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }

  const handleEdit = (booking) => {
    setSelectedBooking(booking)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedBooking(null)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const bookingData = Object.fromEntries(formData.entries())

    try {
      if (selectedBooking) {
        await axios.put(`${import.meta.env.VITE_API_URL}/bookings/${selectedBooking.booking_id}`, bookingData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, bookingData)
      }
      fetchBookings()
      handleClose()
    } catch (error) {
      console.error("Error saving booking:", error)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Booking Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Booking
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Mobile No.</TableCell>
              <TableCell>Billing Name</TableCell>
              <TableCell>Billing Address</TableCell>
              <TableCell>Booking Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.booking_id}>
                <TableCell>{booking.booking_id}</TableCell>
                <TableCell>{booking.client_name}</TableCell>
                <TableCell>{booking.mobileNo}</TableCell>
                <TableCell>{booking.billing_name}</TableCell>
                <TableCell>{booking.billing_address}</TableCell>
                <TableCell>{booking.bookingAmount}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(booking)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedBooking ? "Edit Booking" : "Add Booking"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              fullWidth
              label="Client Name"
              name="client_name"
              margin="normal"
              defaultValue={selectedBooking?.client_name}
            />
            <TextField
              fullWidth
              label="Mobile No."
              name="client_contact_no1"
              margin="normal"
              defaultValue={selectedBooking?.mobileNo}
            />
            <TextField
              fullWidth
              label="Billing Name"
              name="billing_name"
              margin="normal"
              defaultValue={selectedBooking?.billing_name}
            />
            <TextField
              fullWidth
              label="Billing Address"
              name="billing_address"
              margin="normal"
              defaultValue={selectedBooking?.billing_address}
            />
            <TextField
              fullWidth
              label="Booking Amount"
              name="billing_address_pincode"
              margin="normal"
              defaultValue={selectedBooking?.bookingAmount}
            />
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

export default Booking

