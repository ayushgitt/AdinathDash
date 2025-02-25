import React, { useState, useEffect } from "react";
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
  IconButton,
  FormControl,
  InputLabel,
  Autocomplete,
  MenuItem,
  Select,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Eye as EyeIcon, Pencil as PencilIcon } from "lucide-react";
import { styled } from "@mui/material/styles";

// Styled components for custom table elements
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  overflowY: "scroll",
  height: "70vh",
  maxWidth: "100%",
  "& .MuiTable-root": {
    tableLayout: "fixed",
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1",
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1",
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transition: "background-color 0.2s ease",
  },
}));

function MaharajJi() {
  const [dedicatedPersons, setDedicatedPersons] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [salesPersons, setSalesPersons] = useState([]);
  const [primarySalesPerson, setPrimarySalesPerson] = useState(null);
  const [secondarySalesPerson, setSecondarySalesPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    fetchDedicatedPersons();
    fetchSalesPersons();
  }, []);

  const fetchDedicatedPersons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dedicated_persons`);
      setDedicatedPersons(response.data);
    } catch (error) {
      console.error("Error fetching dedicated persons:", error);
      alert("Failed to fetch dedicated persons. Please try again.");
    }
  };

  const fetchSalesPersons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sales`);
      setSalesPersons(response.data);
    } catch (error) {
      console.error("Error fetching sales persons:", error);
      alert("Failed to fetch sales persons. Please try again.");
    }
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setPrimarySalesPerson(person.primary_sales_person);
    setSecondarySalesPerson(person.secondary_sales_person || null);
    setOpenDialog(true);
  };

  const handleViewDetails = (person) => {
    setSelectedDetails(person);
    setViewDetailsDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedPerson(null);
    setFormErrors({});
    setPrimarySalesPerson(null);
    setSecondarySalesPerson(null);
  };

  const handleCloseDetails = () => {
    setViewDetailsDialog(false);
    setSelectedDetails(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const personData = Object.fromEntries(formData.entries());

    personData.primary_sales_person = primarySalesPerson;
    personData.secondary_sales_person = secondarySalesPerson;

    const errors = {};
    if (!personData.name) errors.name = "Name is required*";
    if (!personData.category) errors.category = "Category is required*";
    if (!personData.primary_sales_person) errors.primary_sales_person = "Primary Sales Person is required*";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = selectedPerson
        ? await axios.put(`${import.meta.env.VITE_API_URL}/dedicated_persons/${selectedPerson.id}`, personData)
        : await axios.post(`${import.meta.env.VITE_API_URL}/dedicated_persons`, personData);

      if (response.status === 200 || response.status === 201) {
        await fetchDedicatedPersons();
        handleClose();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error saving dedicated person:", error);
      alert("Failed to save dedicated person. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/dedicated_persons/${id}`);
      fetchDedicatedPersons();
    } catch (error) {
      console.error("Error deleting dedicated person:", error);
      alert("Failed to delete dedicated person. Please try again.");
    }
  };

  const filteredPersons = dedicatedPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Maharaj Ji</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: "white" }}
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
            Add Maharaj Ji
          </Button>
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>ID</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Name</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Category</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Primary Sales Person</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Secondary Sales Person</StyledTableCell>
              <StyledTableCell sx={{ backgroundColor: "#7e1519", color: "white" }}>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPersons.map((person) => (
              <StyledTableRow key={person.id}>
                <StyledTableCell>{person.id}</StyledTableCell>
                <StyledTableCell>{person.name}</StyledTableCell>
                <StyledTableCell>{person.category}</StyledTableCell>
                <StyledTableCell>{person.primary_sales_person}</StyledTableCell>
                <StyledTableCell>{person.secondary_sales_person || "N/A"}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleViewDetails(person)} color="primary" size="small">
                    <EyeIcon size={20} />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(person)} color="primary" size="small">
                    <PencilIcon size={20} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(person.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "80%",
            maxHeight: "90vh",
            m: "auto",
            backgroundColor: "#fdedd1",
          },
        }}
      >
        <DialogTitle>{selectedPerson ? "Edit Maharaj Ji" : "Add Maharaj Ji"}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
                padding: 3,
              }}
            >
              <TextField
                label="Name*"
                name="name"
                defaultValue={selectedPerson?.name}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
                required
              />
              <FormControl fullWidth required error={!!formErrors.category}>
                <InputLabel>Category*</InputLabel>
                <Select
                  name="category"
                  defaultValue={selectedPerson?.category || ""}
                  label="Category*"
                >
                  <MenuItem value="Maharaj ji">Maharaj ji</MenuItem>
                  <MenuItem value="Mata ji">Mata ji</MenuItem>
                  <MenuItem value="Mandir">Mandir</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth required error={!!formErrors.primary_sales_person}>
                <Autocomplete
                  options={salesPersons}
                  getOptionLabel={(option) => `${option.employee_id} - ${option.employee_name} - ${option.phone}`}
                  value={salesPersons.find((sp) => sp.employee_id === primarySalesPerson) || null}
                  onChange={(event, newValue) => {
                    setPrimarySalesPerson(newValue ? newValue.employee_id : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Primary Sales Person*"
                      error={!!formErrors.primary_sales_person}
                      helperText={formErrors.primary_sales_person}
                      required
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  options={salesPersons.filter((sp) => sp.employee_id !== primarySalesPerson)}
                  getOptionLabel={(option) => `${option.employee_id} - ${option.employee_name} - ${option.phone}`}
                  value={salesPersons.find((sp) => sp.employee_id === secondarySalesPerson) || null}
                  onChange={(event, newValue) => {
                    setSecondarySalesPerson(newValue ? newValue.employee_id : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Secondary Sales Person"
                    />
                  )}
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 3 }}>
            <Button onClick={handleClose} variant="outlined" size="large">
              Cancel
            </Button>
            <Button type="submit" variant="contained" size="large" sx={{ backgroundColor: "#7e1519" }}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDetailsDialog}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#fdedd1",
          },
        }}
      >
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          {selectedDetails && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Name:</strong> {selectedDetails.name}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Category:</strong> {selectedDetails.category}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}><strong>Primary Sales Person:</strong> {selectedDetails.primary_sales_person}</Typography>
              <Typography variant="body1"><strong>Secondary Sales Person:</strong> {selectedDetails.secondary_sales_person || "N/A"}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} variant="contained" sx={{ backgroundColor: "#7e1519" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MaharajJi;
