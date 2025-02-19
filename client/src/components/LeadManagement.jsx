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
  MenuItem,
  Grid,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  height: "65vh",
}))

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  overflowY: "scroll",
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1",
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}))

function LeadManagement() {
  const [leads, setLeads] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [eventDate, setEventDate] = useState(null)
  const [dedicatedPersons, setDedicatedPersons] = useState([])
  const [selectedDedicatedPerson, setSelectedDedicatedPerson] = useState("")
  const [salesPersons, setSalesPersons] = useState([])
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("")
  const [salesPersonContact, setSalesPersonContact] = useState("")
  const [step, setStep] = useState(1)
  const [hosts, setHosts] = useState([{ host_name: "", poc_contact: "" }])
  const [leadData, setLeadData] = useState({})

  useEffect(() => {
    fetchLeads()
    fetchDedicatedPersons()
    fetchSalesPersons()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leads`)
      setLeads(response.data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  const fetchDedicatedPersons = async () => {
    try {
      const response = await axios.get("https://adinath-api.rashtechnologies.com/dedicated-persons")
      setDedicatedPersons(response.data)
    } catch (error) {
      console.error("Error fetching dedicated persons:", error)
    }
  }

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get("https://adinath-api.rashtechnologies.com/sales")
      setSalesPersons(response.data)
    } catch (error) {
      console.error("Error fetching sales persons:", error)
    }
  }

  const fetchSalesPersonByDedicatedPerson = async (person) => {
    try {
      const response = await axios.get(`https://adinath-api.rashtechnologies.com/sales/${person}`)
      console.log(response.data);
      if (response.data.length > 0) {
        return response.data[0]
      }
      return null
    } catch (error) {
      console.error("Error fetching sales person:", error)
      return null
    }
  }

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setEventDate(lead.event_date ? new Date(lead.event_date) : null)
    setSelectedDedicatedPerson(lead.maharaj_mandir || "")
    setSelectedSalesPerson(lead.sales_person_1 || "")
    setSalesPersonContact(lead.sales_person_contact_1 || "")
    setHosts(lead.hocs || [{ host_name: "", poc_contact: "" }])
    setLeadData(lead)
    setOpenDialog(true)
    setStep(1)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedLead(null)
    setEventDate(null)
    setSelectedDedicatedPerson("")
    setSelectedSalesPerson("")
    setSalesPersonContact("")
    setStep(1)
    setHosts([{ host_name: "", poc_contact: "" }])
    setLeadData({})
  }

  const handleNext = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const step1Data = Object.fromEntries(formData.entries())

    step1Data.event_date = eventDate ? eventDate.toISOString().split("T")[0] : ""
    step1Data.sales_person_1 = selectedSalesPerson
    step1Data.sales_person_contact_1 = salesPersonContact

    setLeadData({ ...leadData, ...step1Data })
    setStep(2)
  }

  const handleSave = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const step2Data = Object.fromEntries(formData.entries())

    const finalLeadData = {
      ...leadData,
      ...step2Data,
      event_date: eventDate ? eventDate.toISOString().split("T")[0] : "",
      sales_person_1: selectedSalesPerson,
      sales_person_contact_1: salesPersonContact,
      hocs: hosts.map((host) => ({
        host_name: host.host_name,
        poc_contact: host.poc_contact,
      })),
    }

    console.log(finalLeadData)
    try {
      if (selectedLead) {
        await axios.put(`${import.meta.env.VITE_API_URL}/leads/${selectedLead.lead_id}`, finalLeadData)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/leads`, finalLeadData)
      }
      fetchLeads()
      handleClose()
    } catch (error) {
      console.error("Error saving lead:", error)
    }
  }

  const handleDedicatedPersonChange = async (e) => {
    const person = e.target.value
    setSelectedDedicatedPerson(person)

    if (person) {
      const salesPerson = await fetchSalesPersonByDedicatedPerson(person)
      if (salesPerson) {
        setSelectedSalesPerson(salesPerson.employee_id)
        setSalesPersonContact(salesPerson.phone)
      }
    }
  }

  const handleSalesPersonChange = (e) => {
    const selectedId = e.target.value
    setSelectedSalesPerson(selectedId)

    const selectedPerson = salesPersons.find((person) => person.employee_id === Number.parseInt(selectedId))
    if (selectedPerson) {
      setSalesPersonContact(selectedPerson.phone)
    } else {
      setSalesPersonContact("")
    }
  }

  const handleAddHost = () => {
    if (hosts.length < 7) {
      setHosts([...hosts, { host_name: "", poc_contact: "" }])
    }
  }

  const handleHostChange = (index, field, value) => {
    const newHosts = [...hosts]
    newHosts[index][field] = value
    setHosts(newHosts)
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
              backgroundColor: "#fdedd1",
              color: "#7e1519",
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
              {/* <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Host by</TableCell> */}
              {/* <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Host Contact</TableCell> */}
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ height: "50vh", overflowY: "scroll", overflowX: "hidden" }}>
            {leads.map((lead) => (
              <StyledTableRow key={lead.lead_id}>
                <TableCell>{lead.lead_id}</TableCell>
                <TableCell>{lead.lead_name}</TableCell>
                <TableCell>{lead.event_name}</TableCell>
                <TableCell>{lead.event_date}</TableCell>
                <TableCell>{lead.poc_no}</TableCell>
                <TableCell>{lead.sales_person_1}</TableCell>
                {/* <TableCell>{lead.host_name}</TableCell> */}
                {/* <TableCell>{lead.poc_contact}</TableCell> */}
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
        <form onSubmit={step === 1 ? handleNext : handleSave}>
          <DialogContent sx={{ backgroundColor: "#fdedd1" }}>
            {step === 1 && (
              <>
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
                  select
                  fullWidth
                  label="Dedicated Person"
                  name="maharaj_mandir"
                  value={selectedDedicatedPerson}
                  margin="normal"
                  sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                  onChange={handleDedicatedPersonChange}
                >
                  {dedicatedPersons.map((person) => (
                    <MenuItem key={person} value={person}>
                      {person}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Sales Person 1"
                  name="sales_person_1"
                  value={selectedSalesPerson}
                  margin="normal"
                  sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                  disabled
                />
                <TextField
                  fullWidth
                  label="Sales Person Contact 1"
                  name="sales_person_contact_1"
                  value={salesPersonContact}
                  margin="normal"
                  sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                  disabled
                />
              </>
            )}

            {step === 2 && (
              <>
                {hosts.map((host, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Host by"
                        name={`host_name_${index}`}
                        value={host.host_name}
                        margin="normal"
                        onChange={(e) => handleHostChange(index, "host_name", e.target.value)}
                        sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Host Contact"
                        name={`poc_contact_${index}`}
                        value={host.poc_contact}
                        margin="normal"
                        onChange={(e) => handleHostChange(index, "poc_contact", e.target.value)}
                        sx={{ backgroundColor: "white", "& .MuiInputLabel-root": { color: "#7e1519" } }}
                      />
                    </Grid>
                  </Grid>
                ))}
                {hosts.length < 7 && (
                  <Button onClick={handleAddHost} sx={{ color: "#7e1519", mt: 2 }}>
                    Add Host
                  </Button>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#fdedd1" }}>
            {step === 1 && (
              <>
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
                  Next
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button onClick={() => setStep(1)} sx={{ color: "#7e1519" }}>
                  Back
                </Button>
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
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default LeadManagement

