import express from "express"
import { createPool } from "mysql2/promise"
import { hash, compare } from "bcrypt"
import bcrypt from "bcrypt";                         //added this bcrypt
import pkg from 'body-parser';                         //added this also
const { json } = pkg;											  
import bodyParser from "body-parser"
import axios from "axios"; // For ES Module
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
let pool;

// Utility to create a connection pool
try{
   pool = createPool(dbConfig) 
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
      "SELECT employee_id, employee_name FROM AdinathTV_Employees WHERE department_id = 8 AND status NOT LIKE 'Deleted'",
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
    status,                          //in place of mandir,maharaj ji
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
                status = ?,  status_changed_by = ?, login_access = ?
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
      status || null,                        //in place of maharaj ji and mandir
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
    status,                   //change in place of maharaj and mandir
    status_changed_by,
    login_access,
  } = req.body

  try {
    const hashedPassword = password ? await hash(password, 10) : null

    const query = `
            INSERT INTO AdinathTV_Employees (
                employee_name, phone, email, address, work_email, status,
                status_changed_by, department_id, manager_id,
                role, login_access, username, passwd
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `
    const params = [
      employee_name,
      phone,
      email || null,
      address || null,
      work_email || null,
      status || null,
      status_changed_by || null,
      department_id,
      manager_id || null,                                                       //in place mandir,maharaj ji
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

// get list of maharaj ji, mata ji
app.get("/dedicated_persons", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM AdinathTV_Special_Persons"
        );

        if (!rows || rows.length === 0) {
            return res.json([]);
        }

        // Split the concatenated string into an array and remove duplicates
        // const personsList = [...new Set(rows[0].persons.split(","))].map(person => person.trim());

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Add a new Maharaj Ji, Mata Ji, or Mandir
app.post("/dedicated_persons", async (req, res) => {
  const { name, category, primary_sales_person, secondary_sales_person } = req.body;

  if (!name || !primary_sales_person) {
      return res.status(400).json({ error: "Name and primary sales person are required" });
  }

  try {
      const [result] = await pool.query(
          `INSERT INTO AdinathTV_Special_Persons (name, category, primary_sales_person, secondary_sales_person) 
           VALUES (?, ?, ?, ?)`, 
          [name, category, primary_sales_person, secondary_sales_person || null]
      );
      res.json({ id: result.insertId, name, category, primary_sales_person, secondary_sales_person });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Update an existing Maharaj Ji, Mata Ji, or Mandir
app.put("/dedicated_persons/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, primary_sales_person, secondary_sales_person } = req.body;

  if (!name || !primary_sales_person) {
      return res.status(400).json({ error: "Name and primary sales person are required" });
  }

  try {
      const [result] = await pool.query(
          `UPDATE AdinathTV_Special_Persons SET name = ?, category = ?, primary_sales_person = ?, secondary_sales_person = ? WHERE id = ?`,
          [name, category, primary_sales_person, secondary_sales_person || null, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Record not found" });
      }

      res.json({ message: "Record updated successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete a Maharaj Ji, Mata Ji, or Mandir
app.delete("/dedicated_persons/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const [result] = await pool.query(`DELETE FROM AdinathTV_Special_Persons WHERE id = ?`, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Record not found" });
      }

      res.json({ message: "Record deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Get sales
app.get("/sales", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT employee_id, employee_name,phone FROM AdinathTV_Employees WHERE department_id = 1 AND status NOT LIKE 'Deleted'"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get salespersons assigned to a specific Maharaj Ji, Mata Ji, or Mandir
app.get("/sales/:personId", async (req, res) => {
  const { personId } = req.params;
  
  try {
    console.log(personId);
      const [rows] = await pool.query(`
          SELECT e.employee_id, e.employee_name, e.phone 
          FROM AdinathTV_Employees e
          WHERE department_id = 1
          AND (e.employee_id = (SELECT primary_sales_person FROM AdinathTV_Special_Persons WHERE id = ?))
          AND e.status NOT LIKE 'Deleted'
      `, [personId]);
      console.log(rows);
      res.json(rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Retrieve HOCs for a specific lead
// Retrieve HOCs for a specific lead
app.get("/hocs/:leadId", async (req, res) => {
  const { leadId } = req.params;
  try {
    // Query to fetch host details based on host_1 to host_7 for the specified lead_id
    const [leadRows] = await pool.query(`
      SELECT host_1, host_2, host_3, host_4, host_5, host_6, host_7
      FROM AdinathTV_Leads
      WHERE lead_id = ?
    `, [leadId]);

    // Check if the lead exists
    if (leadRows.length === 0) {
      return res.status(404).json({ message: "Lead not found." });
    }

    // Extract host IDs from the lead
    const hostIds = leadRows[0];
    const hocIds = [
      hostIds.host_1,
      hostIds.host_2,
      hostIds.host_3,
      hostIds.host_4,
      hostIds.host_5,
      hostIds.host_6,
      hostIds.host_7
    ].filter(id => id !== null); // Filter out null values

    // If there are no host IDs, return an empty array
    if (hocIds.length === 0) {
      return res.json([]);
    }

    // Query to fetch host details for the retrieved hoc_ids
    const [hostRows] = await pool.query(`
      SELECT *
      FROM AdinathTV_Host_POC
      WHERE hoc_id IN (?)
    `, [hocIds]);

    res.json(hostRows);
  } catch (err) {
    console.error("Error fetching HOCs:", err);
    res.status(500).json({ error: err.message });
  }
});
// Add a new helper function to validate sales_person_1
async function validateSalesPerson(salesPersonId) {					               //added new
    try {
        const [rows] = await pool.query(
            "SELECT employee_id FROM AdinathTV_Employees WHERE employee_id = ? AND status NOT LIKE 'Deleted'",
            [salesPersonId]
        );
        return rows.length > 0;
    } catch (error) {
        console.error("Error validating sales person:", error);
        return false;
    }
} 
// Function to send WhatsApp message
const sendWhatsAppMessage = async (sales_person_contact_1,leadId, leadName, leadContact, eventName, eventDate, maharajJi) => {
    const GRAPH_API_TOKEN = "EAAGOzb1SDB8BO9xNrBfP8Bv84gJ395wWPBZAaRqXvJ9KxOG5W2QcigxWI6TOZBsNqZCdxjnGndJZCp1c7UZCOo41fnvCdU56bkd4EJZAZBFJE851bHTZBZA6KFnJZBRGBfSTF2Qa8VUcfcLmQh0716z8MVQHvAzlLIZAlRF2bsf8dlNXC4zty5FygrGZBYEoAnae5E6dSgZDZD"
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: sales_person_contact_1, // Sending to lead's phone number
      type: "template",
      template: {
        name: "leads_confirm", // Use the registered WhatsApp template name
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: leadId.toString() },
              { type: "text", text: leadName },
              { type: "text", text: leadContact },
              { type: "text", text: eventName },
              { type: "text", text: eventDate },
              { type: "text", text: maharajJi },
            ]
          }
        ]
      }
    };
  
    try {
      const response = await axios.post(
        "https://graph.facebook.com/v18.0/460818373792230/messages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            "Content-Type": "application/json",
          }
        }
      );
      const msgId = response.data.messages[0].id; // Extract message ID
      const sentPayload = JSON.stringify(payload); // Store the request payload
      // Store msg_id and sent_payload in META_Webhook table
        pool.query(
            `INSERT INTO META_Webhook (msg_id,original_payload_sent) VALUES (?,?)`,
            [msgId,sentPayload],
            (dbErr, dbResult) => {
            if (dbErr) {
                console.error("Error storing message ID:", dbErr);
            } else {
                console.log("Message ID stored successfully:", msgId);
            }
            }
        );
      console.log("WhatsApp message sent:", response.data);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    }
  };
// ADD  a lead
app.post("/leads", async (req, res) => {
    const {
        lead_name,
        event_name,
        event_date,
        poc_no,
        location,
        maharaj_mandir,
        sales_person_1,
        hocs
    } = req.body;

    // Validate sales_person_1 (Ensure Employee ID exists)
    const isValidSalesPerson = await validateSalesPerson(sales_person_1);
    if (!isValidSalesPerson) {
        return res.status(400).json({ error: "Invalid sales_person_1: Employee ID does not exist." });
    }

    try {
        const hostIds = new Array(7).fill(null); // Default null for max 7 hosts

        if (hocs && hocs.length > 0) {
            for (let i = 0; i < Math.min(hocs.length, 7); i++) {
                const { host_name, poc_contact } = hocs[i];

                // Check if host already exists
                const [existingHost] = await pool.query(
                    "SELECT hoc_id FROM AdinathTV_Host_POC WHERE host_name = ? AND poc_contact = ? LIMIT 1",
                    [host_name, poc_contact]
                );

                if (existingHost.length > 0) {
                    hostIds[i] = existingHost[0].hoc_id; // Use existing ID
                } else {
                    // Insert new host and get new ID
                    const [newHost] = await pool.query(
                        "INSERT INTO AdinathTV_Host_POC (host_name, poc_contact) VALUES (?, ?)",
                        [host_name, poc_contact]
                    );
                    hostIds[i] = newHost.insertId;
                }
            }
        }

        // Insert into `Leads` table
        const [result] = await pool.query(
            `INSERT INTO AdinathTV_Leads 
            (lead_name, event_name, event_date, poc_no, location, maharaj_mandir, sales_person_1, 
             host_1, host_2, host_3, host_4, host_5, host_6, host_7,  is_assigned, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  0, 'New')`,
            [lead_name, event_name, event_date, poc_no, location, maharaj_mandir, sales_person_1,  ...hostIds]
        );

        const leadId = result.insertId;
        const team = await pool.query("SELECT phone from AdinathTV_Employees where employee_id = ?",[sales_person_1]);
        sendWhatsAppMessage(team[0].phone,leadId, lead_name, poc_no, event_name, event_date, maharaj_mandir);
        res.status(201).json({ message: "Lead added successfully.", leadId });

    } catch (err) {
        console.error("Error adding lead:", err);
        res.status(500).json({ error: err.message });
    }
});

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
    sales_person_2,
    status,
    hocs,
  } = req.body

  try {
    const hostIds = new Array(7).fill(null); // Default null for max 7 hosts

    if (hocs && hocs.length > 0) {
        for (let i = 0; i < Math.min(hocs.length, 7); i++) {
            const { host_name, poc_contact } = hocs[i];

            // Check if host already exists
            const [existingHost] = await pool.query(
                "SELECT hoc_id FROM AdinathTV_Host_POC WHERE host_name = ? AND poc_contact = ? LIMIT 1",
                [host_name, poc_contact]
            );

            if (existingHost.length > 0) {
                hostIds[i] = existingHost[0].hoc_id; // Use existing ID
            } else {
                // Insert new host and get new ID
                const [newHost] = await pool.query(
                    "INSERT INTO AdinathTV_Host_POC (host_name, poc_contact) VALUES (?, ?)",
                    [host_name, poc_contact]
                );
                hostIds[i] = newHost.insertId;
            }
        }
    }
    await pool.query(
      `UPDATE AdinathTV_Leads 
            SET lead_name = ?, event_name = ?, event_date = ?, poc_no = ?, location = ?, maharaj_mandir = ?, 
            sales_person_1 = ?,sales_person_2 = ?,status=?, host_1=?, host_2=?, host_3=?, host_4=?, host_5=?, host_6=?,host_7=?
            WHERE lead_id = ?`,
      [
        lead_name,
        event_name,
        event_date,
        poc_no,
        location,
        maharaj_mandir,
        sales_person_1,
        sales_person_2,
        status,
        leadId,
        ...hostIds,
      ],
    )

    // await pool.query("DELETE FROM AdinathTV_Host_POC WHERE lead_id = ?", [leadId])
    // if (hocs && hocs.length > 0) {
    //   const hocValues = hocs.map((hoc) => [leadId, hoc.host_name, hoc.poc_contact])
    //   await pool.query("INSERT INTO AdinathTV_Host_POC (lead_id, host_name, poc_contact) VALUES ?", [hocValues])
    // }
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

    // await pool.query("DELETE FROM AdinathTV_Host_POC WHERE lead_id = ?", [leadId])

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
      `SELECT *
            FROM AdinathTV_Bookings b`,
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

app.post("/bookings", async (req, res) => {
  const {
    client_id,
    client_name,
    client_contact_no1,
    client_contact_no2,
    billing_name,
    billing_address,
    billing_address_pincode,
    PAN_no,
    GST_no,
    program_type,
    booking_amount,
    advance_received,
    payment_mode,
    cheque_no,
    cheque_date,
    bank_name,
    booked_by,
    designation,
    special_comment,
    status,
    approved_by,
    shooting_address,
    shooting_address_pincode,
    shooting_schedules,
    telecast_schedules,
  } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Insert into AdinathTV_Bookings
    const [bookingResult] = await connection.query(
      `INSERT INTO AdinathTV_Bookings 
        (client_id, client_name, client_contact_no1, client_contact_no2, billing_name, billing_address, 
        billing_address_pincode, PAN_no, GST_no, program_type, booking_amount, advance_received, 
        payment_mode, cheque_no, cheque_date, bank_name, booked_by, designation, special_comment, 
        status, approved_by, shooting_address, shooting_address_pincode, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        client_id,
        client_name,
        client_contact_no1,
        client_contact_no2 || null,
        billing_name,
        billing_address,
        billing_address_pincode,
        PAN_no,
        GST_no,
        program_type,
        booking_amount,
        advance_received,
        payment_mode,
        cheque_no,
        cheque_date,
        bank_name,
        booked_by,
        designation,
        special_comment,
        status,
        approved_by,
        shooting_address,
        shooting_address_pincode,
      ]
    );

    const booking_id = bookingResult.insertId;

    // Insert into AdinathTV_Shooting_Schedules
    if (shooting_schedules && shooting_schedules.length > 0) {
      const shootingValues = shooting_schedules.map(({
        shooting_date,
        shooting_starttime,
        shooting_endtime,
        cameraman_rep_date,
        cameraman_rep_time,
      }) => [
        booking_id,
        shooting_date,
        shooting_starttime,
        shooting_endtime,
        cameraman_rep_date,
        cameraman_rep_time,
      ]);

      await connection.query(
        `INSERT INTO AdinathTV_Shooting_Schedules (booking_id, shooting_date, shooting_starttime, shooting_endtime, cameraman_rep_date, cameraman_rep_time) 
        VALUES ?`,
        [shootingValues]
      );
    }

    // Insert into AdinathTV_Telecast_Schedules
    if (telecast_schedules && telecast_schedules.length > 0) {
      const telecastValues = telecast_schedules.map(({
        telecast_date,
        telecast_starttime,
        telecast_endtime,
        duration,
      }) => [
        booking_id,
        telecast_date,
        telecast_starttime,
        telecast_endtime,
        duration,
      ]);

      await connection.query(
        `INSERT INTO AdinathTV_Telecast_Schedules (booking_id, telecast_date, telecast_starttime, telecast_endtime, duration) 
        VALUES ?`,
        [telecastValues]
      );
    }

    await connection.commit();
    res.status(201).json({ booking_id, message: "Booking created successfully with schedules" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});


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
const PORT = process.env.PORT || 3017
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});