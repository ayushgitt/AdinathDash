import { useState, useEffect } from "react";
import axios from "axios";
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
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  height: "65vh",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  overflowY: "scroll",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1",
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatusBadge = styled(Chip)(({ status }) => ({
  fontWeight: "bold",
  backgroundColor:
    status === "Accepted"
      ? "#4caf50"
      : status === "Rejected"
      ? "#f44336"
      : status === "New"
      ? "#ffeb3b"
      : "#grey",
  color: status === "New" ? "#000" : "#fff",
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: "#7e1519",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(2, 3),
  "& svg": {
    fontSize: "1.8rem",
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: "#fdedd1",
  padding: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 0 0 2px rgba(126, 21, 25, 0.2)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(126, 21, 25, 0.3)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#7e1519",
    fontWeight: 500,
  },
}));

function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [dedicatedPersons, setDedicatedPersons] = useState([]);
  const [selectedDedicatedPerson, setSelectedDedicatedPerson] = useState("");
  const [salesPersons, setSalesPersons] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [selectedSalesPersonWithLead, setSelectedSalesPersonWithLead] = useState("");
  const [step, setStep] = useState(1);
  const [hosts, setHosts] = useState([{ host_name: "", poc_contact: "" }]);
  const [leadData, setLeadData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newDedicatedPerson, setNewDedicatedPerson] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewLead, setViewLead] = useState(null);

  const convertUTCToIST = (date) => {
    if (!date) return null;
    const utcDate = new Date(date);
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(utcDate.getTime() + istOffset);
  };

  const convertISTToUTC = (date) => {
    if (!date) return null;
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() - istOffset);
  };

  const formatDateIST = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
  };

  useEffect(() => {
    fetchLeads();
    fetchDedicatedPersons();
    fetchSalesPersons();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchDedicatedPersons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dedicated_persons`);
      setDedicatedPersons(response.data);
    } catch (error) {
      console.error("Error fetching dedicated persons:", error);
    }
  };

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sales`);
      setSalesPersons(response.data);
    } catch (error) {
      console.error("Error fetching sales persons:", error);
    }
  };

  const handleEdit = async (lead) => {
    setSelectedLead(lead);
    const eventDateIST = convertUTCToIST(lead.event_date).toISOString().split("T")[0];
    setEventDate(eventDateIST);

    const dedicatedPerson = dedicatedPersons.find((person) => person.id === lead.maharaj_mandir);
    setSelectedDedicatedPerson(dedicatedPerson ? dedicatedPerson.id : "");

    // Set both sales person states
    setSelectedSalesPerson(lead.sales_person_1 || "");
    setSelectedSalesPersonWithLead(`${lead.sales_person_1}${lead.lead_name ? ` - ${lead.lead_name}` : ""}`);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/hocs/${lead.lead_id}`);
      setHosts(
        response.data.map((hoc) => ({
          host_name: hoc.host_name,
          poc_contact: hoc.poc_contact,
        }))
      );
    } catch (error) {
      console.error("Error fetching HOCs:", error);
      setHosts([{ host_name: "", poc_contact: "" }]);
    }

    setLeadData(lead);
    setOpenDialog(true);
    setStep(1);
  };

  const handleView = (lead) => {
    setViewLead(lead);
    setOpenViewDialog(true);
  };

  const handleDelete = async (leadId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/leads/${leadId}`);
      fetchLeads(); // Refresh the leads list after deletion
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Error deleting lead. Please try again.");
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedLead(null);
    setEventDate(null);
    setSelectedDedicatedPerson("");
    setSelectedSalesPerson("");
    setSelectedSalesPersonWithLead("");
    setStep(1);
    setHosts([{ host_name: "", poc_contact: "" }]);
    setLeadData({});
    setFormErrors({});
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewLead(null);
  };

  const validateStep1 = () => {
    const errors = {};
    if (!leadData.lead_name) errors.lead_name = "Point Of Contact is required";
    if (!leadData.event_name) errors.event_name = "Event Name is required";
    if (!eventDate) errors.event_date = "Event Date is required";
    if (!leadData.poc_no) errors.poc_no = "POC No. is required";
    if (!leadData.location) errors.location = "Location is required";
    if (!selectedDedicatedPerson) errors.maharaj_mandir = "Dedicated Person is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const step1Data = Object.fromEntries(formData.entries());

    const eventDateUTC = eventDate ? convertISTToUTC(eventDate).toISOString() : "";
    step1Data.event_date = eventDateUTC;
    step1Data.sales_person_1 = selectedSalesPerson;

    setLeadData({ ...leadData, ...step1Data });

    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const step2Data = Object.fromEntries(formData.entries());

    const eventDateUTC = eventDate ? convertISTToUTC(eventDate).toISOString().split("T")[0] : "";

    const finalLeadData = {
      ...leadData,
      ...step2Data,
      event_date: eventDateUTC,
      sales_person_1: selectedSalesPerson,
      maharaj_mandir: selectedDedicatedPerson,
      hocs: hosts.map((host) => ({
        host_name: host.host_name,
        poc_contact: host.poc_contact,
      })),
    };

    try {
      if (selectedLead) {
        await axios.put(`${import.meta.env.VITE_API_URL}/leads/${selectedLead.lead_id}`, finalLeadData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/leads`, finalLeadData);
      }
      fetchLeads();
      handleClose();
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Error saving lead. Please check the data and try again.");
    }
  };

  const handleDedicatedPersonChange = async (e) => {
    const personId = e.target.value;
    setSelectedDedicatedPerson(personId);

    if (personId) {
      const dedicatedPerson = dedicatedPersons.find((person) => person.id === personId);
      if (dedicatedPerson) {
        setSelectedSalesPerson(dedicatedPerson.primary_sales_person);

        // Fetch the lead information for this sales person
        try {
          console.log(dedicatedPerson);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/leads?sales_person_1=${dedicatedPerson.primary_sales_person}`
          );
          console.log(response.data);
          const leadInfo = response.data[0]; // Get the first lead associated with this sales person
          if (leadInfo) {
            setSelectedSalesPersonWithLead(`${dedicatedPerson.primary_sales_person} - ${leadInfo.lead_name}`);
          } else {
            setSelectedSalesPersonWithLead(dedicatedPerson.primary_sales_person);
          }
        } catch (error) {
          console.error("Error fetching lead info:", error);
          setSelectedSalesPersonWithLead(dedicatedPerson.primary_sales_person);
        }
      }
    }
  };

  const handleAddHost = () => {
    if (hosts.length < 7) {
      setHosts([...hosts, { host_name: "", poc_contact: "" }]);
    }
  };

  const handleHostChange = (index, field, value) => {
    const newHosts = [...hosts];
    newHosts[index][field] = value;
    setHosts(newHosts);
  };

  const handleRemoveHost = (index) => {
    const newHosts = hosts.filter((_, i) => i !== index);
    setHosts(newHosts);
  };

  const handleCreateDedicatedPerson = async () => {
    if (!newDedicatedPerson) {
      alert("Please enter a name for the dedicated person.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dedicated_persons`, {
        name: newDedicatedPerson,
        category: "Maharaj",
      });
      setDedicatedPersons([...dedicatedPersons, response.data]);
      setSelectedDedicatedPerson(newDedicatedPerson);
      setOpenCreateDialog(false);
      setNewDedicatedPerson("");
    } catch (error) {
      console.error("Error creating dedicated person:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => lead.lead_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Lead Management</Typography>
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
            Add Lead
          </Button>
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Lead ID</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Point Of Contact</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Event Name</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Event Date</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>POC No.</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Primary Sales Person</TableCell>
              <TableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ height: "50vh", overflowY: "scroll", overflowX: "hidden" }}>
            {filteredLeads.map((lead) => (
              <StyledTableRow key={lead.lead_id}>
                <TableCell>{lead.lead_id}</TableCell>
                <TableCell>{lead.lead_name}</TableCell>
                <TableCell>{lead.event_name}</TableCell>
                <TableCell>
                  {lead.event_date ? formatDateIST(lead.event_date) : ""}
                </TableCell>
                <TableCell>{lead.poc_no}</TableCell>
                <TableCell>{lead.sales_person_1}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleEdit(lead)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleView(lead)}>
                    <VisibilityIcon />
                  </Button>
                  <Button onClick={() => handleDelete(lead.lead_id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <StyledDialogTitle>
          <LiveTvIcon />
          {selectedLead ? "Edit Lead" : "Add Lead"}
        </StyledDialogTitle>
        <form onSubmit={step === 1 ? handleNext : handleSave}>
          <StyledDialogContent>
            {step === 1 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: "#7e1519", fontWeight: "bold" }}>
                  Lead Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Point Of Contact *"
                      name="lead_name"
                      defaultValue={selectedLead?.lead_name}
                      error={!!formErrors.lead_name}
                      helperText={formErrors.lead_name}
                      required
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: "#7e1519", mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Event Name *"
                      name="event_name"
                      defaultValue={selectedLead?.event_name}
                      error={!!formErrors.event_name}
                      helperText={formErrors.event_name}
                      required
                      InputProps={{
                        startAdornment: <EventIcon sx={{ color: "#7e1519", mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Event Date *"
                        value={eventDate}
                        onChange={(newValue) => setEventDate(newValue)}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            fullWidth
                            error={!!formErrors.event_date}
                            helperText={formErrors.event_date}
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="POC No. *"
                      name="poc_no"
                      defaultValue={selectedLead?.poc_no}
                      error={!!formErrors.poc_no}
                      helperText={formErrors.poc_no}
                      required
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: "#7e1519", mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Location *"
                      name="location"
                      defaultValue={selectedLead?.location}
                      error={!!formErrors.location}
                      helperText={formErrors.location}
                      required
                      InputProps={{
                        startAdornment: <LocationOnIcon sx={{ color: "#7e1519", mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      select
                      fullWidth
                      label="Dedicated Person *"
                      name="maharaj_mandir"
                      value={selectedDedicatedPerson}
                      onChange={handleDedicatedPersonChange}
                      error={!!formErrors.maharaj_mandir}
                      helperText={formErrors.maharaj_mandir}
                      required
                    >
                      {dedicatedPersons.map((person) => (
                        <MenuItem key={person.id} value={person.id}>
                          {person.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Primary Sales Person"
                      name="sales_person_1"
                      value={selectedSalesPersonWithLead}
                      disabled
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {step === 2 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: "#7e1519", fontWeight: "bold" }}>
                  Host Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {hosts.map((host, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} md={5}>
                      <StyledTextField
                        fullWidth
                        label={`Host ${index + 1}`}
                        name={`host_name_${index}`}
                        value={host.host_name}
                        onChange={(e) => handleHostChange(index, "host_name", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <StyledTextField
                        fullWidth
                        label="Host Contact"
                        name={`poc_contact_${index}`}
                        value={host.poc_contact}
                        onChange={(e) => handleHostChange(index, "poc_contact", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveHost(index)}
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(244, 67, 54, 0.4)",
                          },
                        }}
                        size="small"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                {hosts.length < 7 && (
                  <Button
                    onClick={handleAddHost}
                    sx={{
                      color: "#7e1519",
                      mt: 2,
                      borderRadius: "20px",
                      border: "1px dashed #7e1519",
                      padding: "6px 12px",
                      "&:hover": {
                        backgroundColor: "rgba(126, 21, 25, 0.1)",
                      },
                    }}
                    startIcon={<AddCircleIcon />}
                    size="small"
                  >
                    Add Another Host
                  </Button>
                )}
              </>
            )}
          </StyledDialogContent>
          <DialogActions sx={{ backgroundColor: "#fdedd1", p: 3 }}>
            {step === 1 && (
              <>
                <Button
                  onClick={handleClose}
                  sx={{
                    color: "#7e1519",
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "rgba(126, 21, 25, 0.1)",
                    },
                  }}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#7e1519",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    boxShadow: "0 4px 10px rgba(126, 21, 25, 0.3)",
                    "&:hover": {
                      backgroundColor: "#fdedd1",
                      color: "#7e1519",
                      boxShadow: "0 6px 15px rgba(126, 21, 25, 0.4)",
                    },
                  }}
                  size="small"
                >
                  Next
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button
                  onClick={() => setStep(1)}
                  sx={{
                    color: "#7e1519",
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "rgba(126, 21, 25, 0.1)",
                    },
                  }}
                  size="small"
                >
                  Back
                </Button>
                <Button
                  onClick={handleClose}
                  sx={{
                    color: "#7e1519",
                    borderRadius: "20px",
                    "&:hover": {
                      backgroundColor: "rgba(126, 21, 25, 0.1)",
                    },
                  }}
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#7e1519",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    boxShadow: "0 4px 10px rgba(126, 21, 25, 0.3)",
                    "&:hover": {
                      backgroundColor: "#fdedd1",
                      color: "#7e1519",
                      boxShadow: "0 6px 15px rgba(126, 21, 25, 0.4)",
                    },
                  }}
                  size="small"
                >
                  Save
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <StyledDialogTitle>
          <LiveTvIcon />
          Lead Details
        </StyledDialogTitle>
        <StyledDialogContent>
          {viewLead && (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: "#7e1519", fontWeight: "bold" }}>
                Lead Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "white", borderRadius: "8px", height: "100%" }}>
                    <Typography variant="h6" sx={{ color: "#7e1519", mb: 2, fontWeight: "bold" }}>
                      Lead Information
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Lead ID:
                        </Typography>
                        <Chip label={viewLead.lead_id} sx={{ backgroundColor: "#7e1519", color: "white" }} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Point Of Contact:
                        </Typography>
                        <Typography>{viewLead.lead_name}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Event Name:
                        </Typography>
                        <Typography>{viewLead.event_name}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Event Date:
                        </Typography>
                        <Typography>{viewLead.event_date ? formatDateIST(viewLead.event_date) : ""}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          POC No.:
                        </Typography>
                        <Typography>{viewLead.poc_no}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "white", borderRadius: "8px", height: "100%" }}>
                    <Typography variant="h6" sx={{ color: "#7e1519", mb: 2, fontWeight: "bold" }}>
                      Additional Details
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Sales Person:
                        </Typography>
                        <Typography>{viewLead.sales_person_1}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Location:
                        </Typography>
                        <Typography>{viewLead.location}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Dedicated Person:
                        </Typography>
                        <Typography>{viewLead.maharaj_mandir}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                          Status:
                        </Typography>
                        <StatusBadge label={viewLead.status || "New"} status={viewLead.status || "New"} />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, backgroundColor: "white", borderRadius: "8px" }}>
                    <Typography variant="h6" sx={{ color: "#7e1519", mb: 2, fontWeight: "bold" }}>
                      Host Information
                    </Typography>
                    <Grid container spacing={2}>
                      {viewLead.hocs && viewLead.hocs.length > 0 ? (
                        viewLead.hocs.map((host, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Paper sx={{ p: 2, backgroundColor: "#fdedd1", borderRadius: "8px" }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Host {index + 1}
                              </Typography>
                              <Typography>Name: {host.host_name}</Typography>
                              <Typography>Contact: {host.poc_contact}</Typography>
                            </Paper>
                          </Grid>
                        ))
                      ) : (
                        <Grid item xs={12}>
                          <Typography sx={{ fontStyle: "italic" }}>No host information available</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </StyledDialogContent>
        <DialogActions sx={{ backgroundColor: "#fdedd1", p: 2 }}>
          <Button
            onClick={handleCloseViewDialog}
            variant="contained"
            sx={{
              backgroundColor: "#7e1519",
              borderRadius: "20px",
              padding: "6px 16px",
              boxShadow: "0 4px 10px rgba(126, 21, 25, 0.3)",
              "&:hover": {
                backgroundColor: "#fdedd1",
                color: "#7e1519",
                boxShadow: "0 6px 15px rgba(126, 21, 25, 0.4)",
              },
            }}
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LeadManagement;
