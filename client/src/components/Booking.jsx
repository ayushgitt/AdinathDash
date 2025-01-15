import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dummy data for the booking table
const bookings = [
  { id: 1, clientName: 'John Doe', mobileNo: '1234567890', billingName: 'John Doe', billingAddress: '123 Main St, City', bookingAmount: 1000 },
  { id: 2, clientName: 'Jane Smith', mobileNo: '9876543210', billingName: 'Jane Smith', billingAddress: '456 Elm St, Town', bookingAmount: 1500 },
  { id: 3, clientName: 'Bob Johnson', mobileNo: '5555555555', billingName: 'Bob Johnson', billingAddress: '789 Oak St, Village', bookingAmount: 2000 },
];

function Booking() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.clientName}</TableCell>
                <TableCell>{booking.mobileNo}</TableCell>
                <TableCell>{booking.billingName}</TableCell>
                <TableCell>{booking.billingAddress}</TableCell>
                <TableCell>{booking.bookingAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Booking;

