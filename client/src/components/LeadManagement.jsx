import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Fade,
  Grow,
} from '@mui/material';

function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedLead(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const leadData = Object.fromEntries(formData.entries());
    leadData.assigned = formData.get('assigned') === 'on';

    try {
      if (selectedLead) {
        await axios.put(`http://localhost:5000/api/leads/${selectedLead.id}`, leadData);
      } else {
        await axios.post('http://localhost:5000/api/leads', leadData);
      }
      fetchLeads();
      handleClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
          <Typography variant="h4">Lead Management</Typography>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Lead
          </Button>
        </Box>

        <Grow in={true} timeout={1000}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead ID</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Event Date</TableCell>
                  <TableCell>Hosted By</TableCell>
                  <TableCell>Sales Person 1</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.id}</TableCell>
                    <TableCell>{lead.eventName}</TableCell>
                    <TableCell>{lead.eventDate}</TableCell>
                    <TableCell>{lead.hostedBy}</TableCell>
                    <TableCell>{lead.salesPerson1}</TableCell>
                    <TableCell>{lead.salesPerson1Status}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(lead)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grow>

        <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
          <form onSubmit={handleSave}>
            <DialogContent>
              <Typography variant="h6" gutterBottom>Lead Form</Typography>
              <TextField
                fullWidth
                label="Lead Generation Date"
                type="date"
                name="generationDate"
                margin="normal"
                defaultValue={selectedLead?.generationDate || new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
              />
              <FormControlLabel
                control={<Checkbox name="assigned" defaultChecked={selectedLead?.assigned || false} />}
                label="Assigned/Unassigned"
              />
              <TextField
                fullWidth
                label="Event Name"
                name="eventName"
                margin="normal"
                defaultValue={selectedLead?.eventName}
              />
              <TextField
                fullWidth
                label="Event Date"
                name="eventDate"
                type="date"
                margin="normal"
                defaultValue={selectedLead?.eventDate}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Hosted by</InputLabel>
                <Select name="hostedBy" defaultValue={selectedLead?.hostedBy || ''}>
                  {['Community Center', 'Local Park', 'City Hall', 'Convention Center', 'Hotel', 'University', 'Other'].map((host) => (
                    <MenuItem key={host} value={host}>{host}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="POC No."
                name="pocNo"
                margin="normal"
                defaultValue={selectedLead?.pocNo}
              />
              <TextField
                fullWidth
                label="Maharaj ji / Mandir ji"
                name="maharajji"
                margin="normal"
                defaultValue={selectedLead?.maharajji}
              />
              <TextField
                fullWidth
                label="Location (optional)"
                name="location"
                margin="normal"
                defaultValue={selectedLead?.location}
              />
              <TextField
                fullWidth
                label="Sales Person 1"
                name="salesPerson1"
                margin="normal"
                defaultValue={selectedLead?.salesPerson1}
              />
              <TextField
                fullWidth
                label="Sales Person Contact 1"
                name="salesPersonContact1"
                margin="normal"
                defaultValue={selectedLead?.salesPersonContact1}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Sales Person 1 Status</InputLabel>
                <Select name="salesPerson1Status" defaultValue={selectedLead?.salesPerson1Status || 'Pending'}>
                  <MenuItem value="Accepted">Accept</MenuItem>
                  <MenuItem value="Rejected">Reject</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Sales Person 2"
                name="salesPerson2"
                margin="normal"
                defaultValue={selectedLead?.salesPerson2}
              />
              <TextField
                fullWidth
                label="Sales Person Contact 2"
                name="salesPersonContact2"
                margin="normal"
                defaultValue={selectedLead?.salesPersonContact2}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Fade>
  );
}

export default LeadManagement;

