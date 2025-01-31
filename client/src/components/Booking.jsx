import React, { useState, useEffect } from "react"
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"

function Booking() {
  const [bookings, setBookings] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    // Dummy data
    const dummyBookings = [
      {
        booking_id: 1,
        date: "2023-06-01",
        client_name: "John Doe",
        shooting_address: "123 Main St, City",
        mobile_no: "1234567890",
        sales_poc: "Jane Smith",
        ref_no: "REF001",
        pin_code: "123456",
        shooting_time: "10:00 AM",
        reporting_time: "09:00 AM",
        cameraman_reporting_date: "2023-06-01",
        shooting_date_from: "2023-06-02",
        billing_name: "John Doe Enterprises",
        billing_address: "456 Business Ave, City",
        billing_pin_code: "654321",
        pan_no: "ABCDE1234F",
        gst_no: "12ABCDE1234F1Z5",
        program: "News",
        live: "Yes",
        vishesh: "No",
        scroll: "Yes",
        promo: "No",
        l_band: "Yes",
        tvc: "No",
        other: "",
        telecast_date_from: "2023-06-03",
        telecast_date_to: "2023-06-04",
        duration: "2 hours",
        telecast_time: "8:00 PM",
        booking_amount: "10000",
        payment_mode: "CHEQUE",
        cheque_dd_no: "123456",
        cheque_date: "2023-05-30",
        bank_name: "XYZ Bank",
        advance_rcvd: "5000",
        booked_by: "Alice Johnson",
        special_comment: "VIP Client",
        approved_by: "Bob Williams",
        designation: "Manager",
      },
      // Add more dummy bookings here if needed
    ]
    setBookings(dummyBookings)
  }, [])

  const handleEdit = (booking) => {
    setSelectedBooking(booking)
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedBooking(null)
  }

  const handleSave = (event) => {
    event.preventDefault()
    // Implement save logic here
    handleClose()
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Mobile No.</TableCell>
              <TableCell>Shooting Address</TableCell>
              <TableCell>Booking Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.booking_id}>
                <TableCell>{booking.booking_id}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.client_name}</TableCell>
                <TableCell>{booking.mobile_no}</TableCell>
                <TableCell>{booking.shooting_address}</TableCell>
                <TableCell>{booking.booking_amount}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(booking)}>Details</Button>
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
            <Typography variant="h6" gutterBottom>
              AADINATH TV CHANNEL BOOKING FORM
            </Typography>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography component="span">Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField fullWidth label="DATE" name="date" margin="normal" defaultValue={selectedBooking?.date} />
                <TextField
                  fullWidth
                  label="CLIENT NAME"
                  name="client_name"
                  margin="normal"
                  defaultValue={selectedBooking?.client_name}
                />
                <TextField
                  fullWidth
                  label="SHOOTING ADDRESS"
                  name="shooting_address"
                  margin="normal"
                  defaultValue={selectedBooking?.shooting_address}
                />
                <TextField
                  fullWidth
                  label="MOBILE No."
                  name="mobile_no"
                  margin="normal"
                  defaultValue={selectedBooking?.mobile_no}
                />
                <TextField
                  fullWidth
                  label="Sales PoC"
                  name="sales_poc"
                  margin="normal"
                  defaultValue={selectedBooking?.sales_poc}
                />
                <TextField
                  fullWidth
                  label="REF NO"
                  name="ref_no"
                  margin="normal"
                  defaultValue={selectedBooking?.ref_no}
                />
                <TextField
                  fullWidth
                  label="PIN CODE"
                  name="pin_code"
                  margin="normal"
                  defaultValue={selectedBooking?.pin_code}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel2-content" id="panel2-header">
                <Typography component="span">Shooting Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="SHOOTING TIME"
                  name="shooting_time"
                  margin="normal"
                  defaultValue={selectedBooking?.shooting_time}
                />
                <TextField
                  fullWidth
                  label="REPORTING TIME"
                  name="reporting_time"
                  margin="normal"
                  defaultValue={selectedBooking?.reporting_time}
                />
                <TextField
                  fullWidth
                  label="CAMERAMAN REPORTING DATE"
                  name="cameraman_reporting_date"
                  margin="normal"
                  defaultValue={selectedBooking?.cameraman_reporting_date}
                />
                <TextField
                  fullWidth
                  label="SHOOTING DATE: From"
                  name="shooting_date_from"
                  margin="normal"
                  defaultValue={selectedBooking?.shooting_date_from}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel3-content" id="panel3-header">
                <Typography component="span">Billing Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="BILLING NAME"
                  name="billing_name"
                  margin="normal"
                  defaultValue={selectedBooking?.billing_name}
                />
                <TextField
                  fullWidth
                  label="BILLING ADDRESS"
                  name="billing_address"
                  margin="normal"
                  defaultValue={selectedBooking?.billing_address}
                />
                <TextField
                  fullWidth
                  label="PIN CODE"
                  name="billing_pin_code"
                  margin="normal"
                  defaultValue={selectedBooking?.billing_pin_code}
                />
                <TextField
                  fullWidth
                  label="PAN No"
                  name="pan_no"
                  margin="normal"
                  defaultValue={selectedBooking?.pan_no}
                />
                <TextField
                  fullWidth
                  label="G.S.T No"
                  name="gst_no"
                  margin="normal"
                  defaultValue={selectedBooking?.gst_no}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel4-content" id="panel4-header">
                <Typography component="span">Program Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="Program"
                  name="program"
                  margin="normal"
                  defaultValue={selectedBooking?.program}
                />
                <TextField fullWidth label="LIVE" name="live" margin="normal" defaultValue={selectedBooking?.live} />
                <TextField
                  fullWidth
                  label="VISHESH"
                  name="vishesh"
                  margin="normal"
                  defaultValue={selectedBooking?.vishesh}
                />
                <TextField
                  fullWidth
                  label="SCROLL"
                  name="scroll"
                  margin="normal"
                  defaultValue={selectedBooking?.scroll}
                />
                <TextField fullWidth label="PROMO" name="promo" margin="normal" defaultValue={selectedBooking?.promo} />
                <TextField
                  fullWidth
                  label="L-BAND"
                  name="l_band"
                  margin="normal"
                  defaultValue={selectedBooking?.l_band}
                />
                <TextField fullWidth label="TVC" name="tvc" margin="normal" defaultValue={selectedBooking?.tvc} />
                <TextField
                  fullWidth
                  label="Other (If Any)"
                  name="other"
                  margin="normal"
                  defaultValue={selectedBooking?.other}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel5-content" id="panel5-header">
                <Typography component="span">Telecast Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="TELECAST DATE: From"
                  name="telecast_date_from"
                  margin="normal"
                  defaultValue={selectedBooking?.telecast_date_from}
                />
                <TextField
                  fullWidth
                  label="TELECAST DATE: To"
                  name="telecast_date_to"
                  margin="normal"
                  defaultValue={selectedBooking?.telecast_date_to}
                />
                <TextField
                  fullWidth
                  label="DURATION"
                  name="duration"
                  margin="normal"
                  defaultValue={selectedBooking?.duration}
                />
                <TextField
                  fullWidth
                  label="TELECAST TIME"
                  name="telecast_time"
                  margin="normal"
                  defaultValue={selectedBooking?.telecast_time}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel6-content" id="panel6-header">
                <Typography component="span">Payment Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="BOOKING AMOUNT"
                  name="booking_amount"
                  margin="normal"
                  defaultValue={selectedBooking?.booking_amount}
                />
                <TextField
                  fullWidth
                  label="PAYMENT MODE"
                  name="payment_mode"
                  margin="normal"
                  defaultValue={selectedBooking?.payment_mode}
                />
                <TextField
                  fullWidth
                  label="CHEQUE/DD NO"
                  name="cheque_dd_no"
                  margin="normal"
                  defaultValue={selectedBooking?.cheque_dd_no}
                />
                <TextField
                  fullWidth
                  label="CHEQUE DATE"
                  name="cheque_date"
                  margin="normal"
                  defaultValue={selectedBooking?.cheque_date}
                />
                <TextField
                  fullWidth
                  label="BANK NAME"
                  name="bank_name"
                  margin="normal"
                  defaultValue={selectedBooking?.bank_name}
                />
                <TextField
                  fullWidth
                  label="ADVANCE RCVD"
                  name="advance_rcvd"
                  margin="normal"
                  defaultValue={selectedBooking?.advance_rcvd}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel7-content" id="panel7-header">
                <Typography component="span">Additional Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  label="BOOKED BY"
                  name="booked_by"
                  margin="normal"
                  defaultValue={selectedBooking?.booked_by}
                />
                <TextField
                  fullWidth
                  label="SPECIAL COMMENT"
                  name="special_comment"
                  margin="normal"
                  defaultValue={selectedBooking?.special_comment}
                />
                <TextField
                  fullWidth
                  label="APPROVED BY"
                  name="approved_by"
                  margin="normal"
                  defaultValue={selectedBooking?.approved_by}
                />
                <TextField
                  fullWidth
                  label="DESIGNATION"
                  name="designation"
                  margin="normal"
                  defaultValue={selectedBooking?.designation}
                />
              </AccordionDetails>
            </Accordion>
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

