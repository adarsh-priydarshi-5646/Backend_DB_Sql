const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let db;
const PORT = process.env.PORT || 3000;

app.get("/contacts", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM contacts");
  res.status(200).json(rows);
});

app.get("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);
  res.status(200).json(rows[0]);
});

app.post("/contacts", async (req, res) => {
  const { full_name, email, phone_no } = req.body;
  await db.query(
    "INSERT INTO contacts (full_name, email, phone_no) VALUES (?, ?, ?)",
    [full_name, email, phone_no]
  );
  res.status(201).json({ message: "Contact added successfully" });
});

// Search contacts by full_name, email, or phone_no
app.get("/contacts", async (req, res) => {
  const { full_name, email, phone_no } = req.query;
  const [rows] = await db.query(
    "SELECT * FROM contacts WHERE full_name LIKE ? AND email LIKE ? AND phone_no LIKE ?",
    [`%${full_name || ""}%`, `%${email || ""}%`, `%${phone_no || ""}%`]
  );

  const data = rows.map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone_no: row.phone_no,
  }));
  res.status(200).json({data});
});


app.put("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone_no } = req.body;
  await db.query(
    "UPDATE contacts SET full_name = ?, email = ?, phone_no = ? WHERE id = ?",
    [full_name, email, phone_no, id]
  );
  res.status(200).send("Contact updated");
});


app.patch("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone_no } = req.body;
  const [rows] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).send("Contact not found");
  }
  const contact = rows[0];
  const up = full_name || contact.full_name;
  const em = email || contact.email;
  const ph = phone_no || contact.phone_no;

  // const updatedContact = {
  //...result[0],
  //...req.body,
  //};

  await db.query(
    "UPDATE contacts SET full_name = ?, email = ?, phone_no = ? WHERE id = ?",
    [up, em, ph, id]
  );
  res.status(200).send("Contact updated");
});


app.delete("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const [result] = db.query("SELECT * FROM contacts WHERE id = ?", [id]);
  if (result.length === 0) {
    return res.status(404).send("Contact not found");
  }
  await db.query("DELETE FROM contacts WHERE id = ?", [id]);
  res.status(200).send("Contact deleted successfully");
});


mysql
  .createConnection({
    host: "localhost",
    user: "root",
    database: "contact_db",
    password: "Adarshpriydarshi",
  })
  .then((connection) => {
    db = connection;
    app.listen(PORT, () => {
      console.log("Server is running on port 3000");
    });
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
