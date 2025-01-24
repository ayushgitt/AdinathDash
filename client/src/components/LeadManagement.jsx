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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material"

function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)

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
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedLead(null)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const leadData = Object.fromEntries(formData.entries())

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
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Lead Management</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Add Lead
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lead ID</TableCell>
              <TableCell>Lead Name</TableCell>
              <TableCell>Event Name</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>POC No.</TableCell>
              <TableCell>Sales Person 1</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.lead_id}>
                <TableCell>{lead.lead_id}</TableCell>
                <TableCell>{lead.lead_name}</TableCell>
                <TableCell>{lead.event_name}</TableCell>
                <TableCell>{lead.event_date}</TableCell>
                <TableCell>{lead.poc_no}</TableCell>
                <TableCell>{lead.sales_person_1}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(lead)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedLead ? "Edit Lead" : "Add Lead"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              fullWidth
              label="Lead Name"
              name="lead_name"
              margin="normal"
              defaultValue={selectedLead?.lead_name}
            />
            <TextField
              fullWidth
              label="Event Name"
              name="event_name"
              margin="normal"
              defaultValue={selectedLead?.event_name}
            />
            <TextField
              fullWidth
              label="Event Date"
              name="event_date"
              type="date"
              margin="normal"
              defaultValue={selectedLead?.event_date}
              InputLabelProps={{ shrink: true }}
            />
            <TextField fullWidth label="POC No." name="poc_no" margin="normal" defaultValue={selectedLead?.poc_no} />
            <TextField
              fullWidth
              label="Location"
              name="location"
              margin="normal"
              defaultValue={selectedLead?.location}
            />
            <TextField
              fullWidth
              label="Maharaj ji / Mandir ji"
              name="maharaj_mandir"
              margin="normal"
              defaultValue={selectedLead?.maharaj_mandir}
            />
            <TextField
              fullWidth
              label="Sales Person 1"
              name="sales_person_1"
              margin="normal"
              defaultValue={selectedLead?.sales_person_1}
            />
            <TextField
              fullWidth
              label="Sales Person Contact 1"
              name="sales_person_contact_1"
              margin="normal"
              defaultValue={selectedLead?.sales_person_contact_1}
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

export default LeadManagement

