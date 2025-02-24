import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled components for custom table elements
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  height: "65vh",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  overflowY: 'scroll'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1", // Background color for table entries
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1", // Ensure odd rows also have the same color
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [shootingSchedules, setShootingSchedules] = useState([]);
  const [telecastSchedules, setTelecastSchedules] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings. Please try again.");
    }
  };

  const handleEdit = async (booking) => {
    setSelectedBooking(booking);
    try {
      const shootingResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${booking.booking_id}/shooting-schedules`
      );
      setShootingSchedules(shootingResponse.data);

      const telecastResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${booking.booking_id}/telecast-schedules`
      );
      setTelecastSchedules(telecastResponse.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      alert("Failed to fetch schedules. Please try again.");
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setShootingSchedules([]);
    setTelecastSchedules([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookingData = Object.fromEntries(formData.entries());

    try {
      if (selectedBooking) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/bookings/${selectedBooking.booking_id}`,
          bookingData
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, bookingData);
      }
      fetchBookings(); // Refresh the booking list
      handleClose();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Booking ID</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Date</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Client Name</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Mobile No.</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Shooting Address</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Booking Amount</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <StyledTableRow key={booking.booking_id}>
                <TableCell>{booking.booking_id}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.client_name}</TableCell>
                <TableCell>{booking.mobileNo}</TableCell>
                <TableCell>{booking.shooting_address}</TableCell>
                <TableCell>{booking.bookingAmount}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(booking)}
                    sx={{
                      backgroundColor: "#7e1519",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#fdedd1",
                        color: "#7e1519",
                      },
                    }}
                  >
                    Details
                  </Button>
                </TableCell>
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
            backgroundColor: "#fdedd1", // Background color for the AADINATH TV BOOKING FORM
          },
        }}
      >
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
                <TextField fullWidth label="DATE" name="date" margin="normal" defaultValue={selectedBooking?.created_at} disabled />
                <TextField
                  fullWidth
                  label="CLIENT NAME"
                  name="client_name"
                  margin="normal"
                  defaultValue={selectedBooking?.client_name}
                  disabled
                />
                <TextField
                  fullWidth
                  label="SHOOTING ADDRESS"
                  name="shooting_address"
                  margin="normal"
                  defaultValue={selectedBooking?.shooting_address}
                  disabled
                />
                <TextField
                  fullWidth
                  label="MOBILE No."
                  name="mobileNo"
                  margin="normal"
                  defaultValue={selectedBooking?.client_contact_no1}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Sales PoC"
                  name="sales_poc"
                  margin="normal"
                  defaultValue={selectedBooking?.sales_poc}
                  disabled
                />
                <TextField
                  fullWidth
                  label="REF NO"
                  name="ref_no"
                  margin="normal"
                  defaultValue={selectedBooking?.ref_no}
                  disabled
                />
                <TextField
                  fullWidth
                  label="PIN CODE"
                  name="pin_code"
                  margin="normal"
                  defaultValue={selectedBooking?.shooting_address_pincode}
                  disabled
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel2-content" id="panel2-header">
                <Typography component="span">Shooting Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {shootingSchedules.map((schedule, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="SHOOTING TIME"
                      name="shooting_time"
                      margin="normal"
                      defaultValue={schedule.shooting_starttime}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="REPORTING TIME"
                      name="reporting_time"
                      margin="normal"
                      defaultValue={schedule.cameraman_rep_time}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="CAMERAMAN REPORTING DATE"
                      name="cameraman_reporting_date"
                      margin="normal"
                      defaultValue={schedule.cameraman_rep_date}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="SHOOTING DATE: From"
                      name="shooting_date_from"
                      margin="normal"
                      defaultValue={schedule.shooting_date}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="SHOOTING DATE: To"
                      name="shooting_date_to"
                      margin="normal"
                      defaultValue={schedule.shooting_endtime}
                      disabled
                    />
                  </Box>
                ))}
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
                  disabled
                />
                <TextField
                  fullWidth
                  label="BILLING ADDRESS"
                  name="billing_address"
                  margin="normal"
                  defaultValue={selectedBooking?.billing_address}
                  disabled
                />
                <TextField
                  fullWidth
                  label="PIN CODE"
                  name="billing_pin_code"
                  margin="normal"
                  defaultValue={selectedBooking?.billing_address_pincode}
                  disabled
                />
                <TextField
                  fullWidth
                  label="PAN No"
                  name="pan_no"
                  margin="normal"
                  defaultValue={selectedBooking?.PAN_no}
                  disabled
                />
                <TextField
                  fullWidth
                  label="G.S.T No"
                  name="gst_no"
                  margin="normal"
                  defaultValue={selectedBooking?.GST_no}
                  disabled
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
                  disabled
                />
                <TextField fullWidth label="LIVE" name="live" margin="normal" defaultValue={selectedBooking?.live} disabled />
                <TextField
                  fullWidth
                  label="VISHESH"
                  name="vishesh"
                  margin="normal"
                  defaultValue={selectedBooking?.vishesh}
                  disabled
                />
                <TextField
                  fullWidth
                  label="SCROLL"
                  name="scroll"
                  margin="normal"
                  defaultValue={selectedBooking?.scroll}
                  disabled
                />
                <TextField fullWidth label="PROMO" name="promo" margin="normal" defaultValue={selectedBooking?.promo} disabled />
                <TextField
                  fullWidth
                  label="L-BAND"
                  name="l_band"
                  margin="normal"
                  defaultValue={selectedBooking?.l_band}
                  disabled
                />
                <TextField fullWidth label="TVC" name="tvc" margin="normal" defaultValue={selectedBooking?.tvc} disabled />
                <TextField
                  fullWidth
                  label="Other (If Any)"
                  name="other"
                  margin="normal"
                  defaultValue={selectedBooking?.other}
                  disabled
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="panel5-content" id="panel5-header">
                <Typography component="span">Telecast Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {telecastSchedules.map((schedule, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="TELECAST DATE: From"
                      name="telecast_date_from"
                      margin="normal"
                      defaultValue={schedule.telecast_date}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="TELECAST DATE: To"
                      name="telecast_date_to"
                      margin="normal"
                      defaultValue={schedule.telecast_endtime}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="DURATION"
                      name="duration"
                      margin="normal"
                      defaultValue={schedule.duration}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="TELECAST TIME"
                      name="telecast_time"
                      margin="normal"
                      defaultValue={schedule.telecast_starttime}
                      disabled
                    />
                  </Box>
                ))}
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
                  disabled
                />
                <TextField
                  fullWidth
                  label="PAYMENT MODE"
                  name="payment_mode"
                  margin="normal"
                  defaultValue={selectedBooking?.payment_mode}
                  disabled
                />
                <TextField
                  fullWidth
                  label="CHEQUE/DD NO"
                  name="cheque_dd_no"
                  margin="normal"
                  defaultValue={selectedBooking?.cheque_dd_no}
                  disabled
                />
                <TextField
                  fullWidth
                  label="CHEQUE DATE"
                  name="cheque_date"
                  margin="normal"
                  defaultValue={selectedBooking?.cheque_date}
                  disabled
                />
                <TextField
                  fullWidth
                  label="BANK NAME"
                  name="bank_name"
                  margin="normal"
                  defaultValue={selectedBooking?.bank_name}
                  disabled
                />
                <TextField
                  fullWidth
                  label="ADVANCE RCVD"
                  name="advance_rcvd"
                  margin="normal"
                  defaultValue={selectedBooking?.advance_rcvd}
                  disabled
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
                  disabled
                />
                <TextField
                  fullWidth
                  label="SPECIAL COMMENT"
                  name="special_comment"
                  margin="normal"
                  defaultValue={selectedBooking?.special_comment}
                  disabled
                />
                <TextField
                  fullWidth
                  label="APPROVED BY"
                  name="approved_by"
                  margin="normal"
                  defaultValue={selectedBooking?.approved_by}
                  disabled
                />
                <TextField
                  fullWidth
                  label="DESIGNATION"
                  name="designation"
                  margin="normal"
                  defaultValue={selectedBooking?.designation}
                  disabled
                />
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#7e1519",
                "&:hover": {
                  backgroundColor: "#fdedd1", // Hover color for the Save button
                  color: "#7e1519", // Change text color on hover for better contrast
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Booking;
