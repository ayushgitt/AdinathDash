import express from "express"
import { createPool } from "mysql2/promise"
import { hash, compare } from "bcrypt"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(bodyParser.json())


// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

// Utility to create a connection pool
try{
  const pool = createPool(dbConfig) 
  console.log("connect to pokemon");
}
catch(E){
  console.log(E);
}
// Get all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT e.*, d.department_name FROM AdinathTV_Employees e LEFT JOIN AdinathTV_Departments d ON e.department_id = d.department_id WHERE e.status NOT LIKE 'Deleted'",
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get managers
app.get("/managers", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT employee_id, employee_name FROM AdinathTV_Employees WHERE department_id = 8",
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get departments
app.get("/departments", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT department_id, department_name FROM AdinathTV_Departments")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update user
app.put("/users/:id", async (req, res) => {
  const {
    employee_name,
    phone,
    email,
    address,
    work_email,
    department_id,
    username,
    password,
    role,
    manager_id,
    status,
    mandir,
    maharaj_ji,
    status_changed_by,
    login_access,
  } = req.body
  const { id } = req.params

  try {
    const hashedPassword = password ? await hash(password, 10) : null

    const query = `
            UPDATE AdinathTV_Employees
            SET employee_name = ?, phone = ?, email = ?, address = ?, work_email = ?,
                department_id = ?, username = ?, passwd = COALESCE(?, passwd), role = ?, manager_id = ?,
                status = ?, mandir = ?, maharaj_ji = ?, status_changed_by = ?, login_access = ?
            WHERE employee_id = ?`
    const params = [
      employee_name,
      phone,
      email || null,
      address || null,
      work_email || null,
      department_id,
      username || null,
      hashedPassword,
      role || null,
      manager_id || null,
      status || null,
      mandir || null,
      maharaj_ji || null,
      status_changed_by || null,
      login_access || false,
      id,
    ]

    await pool.query(query, params)
    res.json({ message: "Employee updated successfully!" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params

  try {
    await pool.query("UPDATE AdinathTV_Employees SET status = 'Deleted' WHERE employee_id = ?", [id])
    res.json({ message: "Employee deleted successfully!" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add new user
app.post("/users", async (req, res) => {
  const {
    employee_name,
    phone,
    email,
    address,
    work_email,
    department_id,
    username,
    password,
    role,
    manager_id,
    status,
    mandir,
    maharaj_ji,
    status_changed_by,
    login_access,
  } = req.body

  try {
    const hashedPassword = password ? await hash(password, 10) : null

    const query = `
            INSERT INTO AdinathTV_Employees (
                employee_name, phone, email, address, work_email, status,
                status_changed_by, department_id, manager_id, maharaj_ji,
                mandir, role, login_access, username, passwd
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const params = [
      employee_name,
      phone,
      email || null,
      address || null,
      work_email || null,
      status || null,
      status_changed_by || null,
      department_id,
      manager_id || null,
      maharaj_ji || null,
      mandir || null,
      role || null,
      login_access || false,
      username || null,
      hashedPassword,
    ]

    await pool.query(query, params)
    res.json({ message: "Employee added successfully!" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Retrieve all leads
app.get("/leads", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM AdinathTV_Leads")
    res.json(rows)
  } catch (err) {
    console.error("Error fetching leads:", err)
    res.status(500).json({ error: err.message })
  }
})

// Retrieve HOCs for a specific lead
app.get("/hocs/:leadId", async (req, res) => {
  const { leadId } = req.params
  try {
    const [rows] = await pool.query("SELECT * FROM AdinathTV_Host_POC WHERE lead_id = ?", [leadId])
    res.json(rows)
  } catch (err) {
    console.error("Error fetching HOCs:", err)
    res.status(500).json({ error: err.message })
  }
})

// Add a new lead
app.post("/leads", async (req, res) => {
  const {
    lead_name,
    event_name,
    event_date,
    poc_no,
    location,
    maharaj_mandir,
    sales_person_1,
    sales_person_contact_1,
    hocs,
  } = req.body

  try {
    const [result] = await pool.query(
      `INSERT INTO AdinathTV_Leads 
            (lead_name, event_name, event_date, poc_no, location, maharaj_mandir, sales_person_1, sales_person_contact_1) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [lead_name, event_name, event_date, poc_no, location, maharaj_mandir, sales_person_1, sales_person_contact_1],
    )

    const leadId = result.insertId

    if (hocs && hocs.length > 0) {
      const hocValues = hocs.map((hoc) => [leadId, hoc.host_name, hoc.poc_contact])
      await pool.query("INSERT INTO AdinathTV_Host_POC (lead_id, host_name, poc_contact) VALUES ?", [hocValues])
    }

    res.status(201).json({ message: "Lead and HOCs added successfully.", leadId })
  } catch (err) {
    console.error("Error adding lead:", err)
    res.status(500).json({ error: err.message })
  }
})

// Update a lead
app.put("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params
  const {
    lead_name,
    event_name,
    event_date,
    poc_no,
    location,
    maharaj_mandir,
    sales_person_1,
    sales_person_contact_1,
    hocs,
  } = req.body

  try {
    await pool.query(
      `UPDATE AdinathTV_Leads 
            SET lead_name = ?, event_name = ?, event_date = ?, poc_no = ?, location = ?, maharaj_mandir = ?, 
            sales_person_1 = ?, sales_person_contact_1 = ? 
            WHERE lead_id = ?`,
      [
        lead_name,
        event_name,
        event_date,
        poc_no,
        location,
        maharaj_mandir,
        sales_person_1,
        sales_person_contact_1,
        leadId,
      ],
    )

    await pool.query("DELETE FROM AdinathTV_Host_POC WHERE lead_id = ?", [leadId])

    if (hocs && hocs.length > 0) {
      const hocValues = hocs.map((hoc) => [leadId, hoc.host_name, hoc.poc_contact])
      await pool.query("INSERT INTO AdinathTV_Host_POC (lead_id, host_name, poc_contact) VALUES ?", [hocValues])
    }

    res.json({ message: "Lead updated successfully." })
  } catch (err) {
    console.error("Error updating lead:", err)
    res.status(500).json({ error: err.message })
  }
})

// Delete a lead
app.delete("/leads/:leadId", async (req, res) => {
  const { leadId } = req.params

  try {
    await pool.query("DELETE FROM AdinathTV_Leads WHERE lead_id = ?", [leadId])

    await pool.query("DELETE FROM AdinathTV_Host_POC WHERE lead_id = ?", [leadId])

    res.json({ message: "Lead and associated HOCs deleted successfully." })
  } catch (err) {
    console.error("Error deleting lead:", err)
    res.status(500).json({ error: err.message })
  }
})

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
            b.booking_id, 
            b.client_name, 
            b.client_contact_no1 AS mobileNo, 
            b.billing_name, 
            b.billing_address, 
            b.billing_address_pincode AS bookingAmount
            FROM AdinathTV_Bookings b`,
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Create a new booking
app.post("/bookings", async (req, res) => {
  const {
    client_name,
    client_contact_no1,
    client_contact_no2,
    billing_name,
    billing_address,
    billing_address_pincode,
    PAN_no,
    GST_no,
    program_type,
    shooting_address,
    shooting_address_pincode,
  } = req.body

  try {
    const [result] = await pool.query(
      `INSERT INTO AdinathTV_Bookings 
            (client_name, client_contact_no1, client_contact_no2, billing_name, billing_address,
            billing_address_pincode, PAN_no, GST_no, program_type, shooting_address, shooting_address_pincode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_name,
        client_contact_no1,
        client_contact_no2 || null,
        billing_name,
        billing_address,
        billing_address_pincode,
        PAN_no,
        GST_no,
        program_type,
        shooting_address,
        shooting_address_pincode,
      ],
    )
    res.status(201).json({ booking_id: result.insertId, message: "Booking created successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Get shooting schedules for a booking
app.get("/bookings/:bookingId/shooting-schedules", async (req, res) => {
  const { bookingId } = req.params

  try {
    const [rows] = await pool.query(
      `SELECT 
            shooting_id, 
            shooting_date, 
            shooting_starttime, 
            shooting_endtime, 
            cameraman_rep_date, 
            cameraman_rep_time 
            FROM AdinathTV_Shooting_Schedules 
            WHERE booking_id = ?`,
      [bookingId],
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Get telecast schedules for a booking
app.get("/bookings/:bookingId/telecast-schedules", async (req, res) => {
  const { bookingId } = req.params

  try {
    const [rows] = await pool.query(
      `SELECT 
            telecast_id, 
            telecast_date, 
            telecast_starttime, 
            telecast_endtime, 
            duration 
            FROM AdinathTV_Telecast_Schedules 
            WHERE booking_id = ?`,
      [bookingId],
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

// Login endpoint
app.post("/login", async (req, res) => {
  console.log("Login attempt:", req.body)
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" })
  }

  try {
    const [rows] = await pool.query("SELECT * FROM AdinathTV_Employees WHERE username = ?", [username])

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    const user = rows[0]
    const isPasswordMatch = await compare(password, user.passwd)

    if (isPasswordMatch) {
      res.status(200).json({ success: true, role: user.role })
    } else {
      res.status(401).json({ success: false, message: "Invalid password" })
    }
  } catch (error) {
    console.error("Error during authentication:", error)
    res.status(500).json({ success: false, message: "Database error" })
  }
})

// Get lead statistics
app.get("/lead-stats", async (req, res) => {
  try {
    const [rows] = await pool.query(`
            SELECT 
                DATE_FORMAT(event_date, '%Y-%m') AS month,
                COUNT(*) AS leads
            FROM AdinathTV_Leads
            WHERE event_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY month
        `)
    res.json(rows)
  } catch (error) {
    console.error("Error fetching lead stats:", error)
    res.status(500).json({ error: error.message })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

