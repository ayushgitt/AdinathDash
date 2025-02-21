"use client";

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
  IconButton,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components for custom table elements
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
  overflowY: "scroll",
  height: "70vh",
  maxWidth: "100%", // Prevent horizontal scrolling
  "& .MuiTable-root": {
    tableLayout: "fixed", // Fixed table layout to prevent horizontal scrolling
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px", // Limit cell width
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fdedd1", // Background color for table entries
  "&:nth-of-type(odd)": {
    backgroundColor: "#fdedd1", // Ensure odd rows also have the same color
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

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedPerson(null);
    setFormErrors({});
    setPrimarySalesPerson(null);
    setSecondarySalesPerson(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const personData = Object.fromEntries(formData.entries());

    // Add primary and secondary sales person IDs to the form data
    personData.primary_sales_person = primarySalesPerson;
    personData.secondary_sales_person = secondarySalesPerson;

    // Form validation
    const errors = {};
    if (!personData.name) errors.name = "Name is required";
    if (!personData.category) errors.category = "Category is required";
    if (!personData.primary_sales_person) errors.primary_sales_person = "Primary Sales Person is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = selectedPerson
        ? await axios.put(`${import.meta.env.VITE_API_URL}/dedicated_persons/${selectedPerson.id}`, personData)
        : await axios.post(`${import.meta.env.VITE_API_URL}/dedicated_persons`, personData);

      if (response.status === 200 || response.status === 201) {
        await fetchDedicatedPersons(); // Refresh the list
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
      fetchDedicatedPersons(); // Refresh the list
    } catch (error) {
      console.error("Error deleting dedicated person:", error);
      alert("Failed to delete dedicated person. Please try again.");
    }
  };

  return (
    <Box sx={{ height: "100vh", overflow: "hidden", p: 3, backgroundColor: "rgba(253,232,199,255)" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Maharaj Ji</Typography>
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
            {dedicatedPersons.map((person) => (
              <StyledTableRow key={person.id}>
                <StyledTableCell>{person.id}</StyledTableCell>
                <StyledTableCell>{person.name}</StyledTableCell>
                <StyledTableCell>{person.category}</StyledTableCell>
                <StyledTableCell>{person.primary_sales_person}</StyledTableCell>
                <StyledTableCell>{person.secondary_sales_person || "N/A"}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleEdit(person)} color="primary" size="small">
                    <EditIcon />
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
                label="Name"
                name="name"
                defaultValue={selectedPerson?.name}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
              />
              <TextField
                label="Category"
                name="category"
                defaultValue={selectedPerson?.category}
                error={!!formErrors.category}
                helperText={formErrors.category}
                fullWidth
              />
              <FormControl fullWidth error={!!formErrors.primary_sales_person}>
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
                      label="Primary Sales Person"
                      error={!!formErrors.primary_sales_person}
                      helperText={formErrors.primary_sales_person}
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
    </Box>
  );
}

export default MaharajJi;
