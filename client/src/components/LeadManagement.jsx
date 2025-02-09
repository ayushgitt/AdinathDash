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
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker" // Import DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider" // Import LocalizationProvider
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns" // Import AdapterDateFns

// Styled components for custom table elements
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
}))

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1", // Background color for table entries
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1", // Ensure odd rows also have the same color
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}))

function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [eventDate, setEventDate] = useState(null) // State for DatePicker

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leads`)
      setLeads(response.data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setEventDate(lead.event_date ? new Date(lead.event_date) : null) // Set initial date for DatePicker
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedLead(null)
    setEventDate(null) // Reset date on close
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const leadData = Object.fromEntries(formData.entries())

    // Add the event date from the DatePicker to the lead data
    leadData.event_date = eventDate ? eventDate.toISOString().split("T")[0] : ""

    try {
      if (selectedLead) {
        await axios.put(`${import.meta.env.VITE_API_URL}/leads/${selectedLead.lead_id}`, leadData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/leads`, leadData)
      }
      fetchLeads()
      handleClose()
    } catch (error) {
      console.error("Error saving lead:", error)
    }
  }

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Lead Management</Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: "#7e1519",
            "&:hover": {
              backgroundColor: "#fdedd1", // Hover color for the "Add Lead" button
              color: "#7e1519", // Change text color on hover for better contrast
            },
          }}
        >
          Add Lead
        </Button>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Lead ID</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Lead Name</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Event Date</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>POC No.</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Sales Person 1</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <StyledTableRow key={lead.lead_id}>
                <TableCell>{lead.lead_id}</TableCell>
                <TableCell>{lead.lead_name}</TableCell>
                <TableCell>{lead.event_name}</TableCell>
                <TableCell>{lead.event_date}</TableCell>
                <TableCell>{lead.poc_no}</TableCell>
                <TableCell>{lead.sales_person_1}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(lead)}>
                    Edit
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#fdedd1", color: "#7e1519" }}>
          {selectedLead ? "Edit Lead" : "Add Lead"}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent sx={{ backgroundColor: "#fdedd1" }}>
            <TextField
              fullWidth
              label="Lead Name"
              name="lead_name"
              margin="normal"
              defaultValue={selectedLead?.lead_name}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <TextField
              fullWidth
              label="Event Name"
              name="event_name"
              margin="normal"
              defaultValue={selectedLead?.event_name}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Event Date"
                value={eventDate}
                onChange={(newValue) => setEventDate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="POC No."
              name="poc_no"
              margin="normal"
              defaultValue={selectedLead?.poc_no}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              margin="normal"
              defaultValue={selectedLead?.location}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <TextField
              fullWidth
              label="Maharaj ji / Mandir ji"
              name="maharaj_mandir"
              margin="normal"
              defaultValue={selectedLead?.maharaj_mandir}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <TextField
              fullWidth
              label="Sales Person 1"
              name="sales_person_1"
              margin="normal"
              defaultValue={selectedLead?.sales_person_1}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
            <TextField
              fullWidth
              label="Sales Person Contact 1"
              name="sales_person_contact_1"
              margin="normal"
              defaultValue={selectedLead?.sales_person_contact_1}
              sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#fdedd1" }}>
            <Button onClick={handleClose} sx={{ color: "#7e1519" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#7e1519",
                "&:hover": {
                  backgroundColor: "#fdedd1",
                  color: "#7e1519",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default LeadManagement