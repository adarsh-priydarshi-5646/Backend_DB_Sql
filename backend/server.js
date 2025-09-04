const mysql = require('mysql2/promise');
const express = require('express');
const cors  = require('cors');
// const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());

let db;

// Multer config - store file in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// POST method with image
// app.post('/contacts', upload.single('profile_image'), async (req, res) => {
//     try {
//         const { full_name, email, phone_no } = req.body;
//         const imageBuffer = req.file ? req.file.buffer : null;

//         await db.query(
//             'INSERT INTO contacts (full_name, email, phone_no, profile_image) VALUES (?, ?, ?, ?)',
//             [full_name, email, phone_no, imageBuffer]
//         );

//         res.status(201).json({ message: 'Contact added successfully with image' });
//     } 
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error adding contact' });
//     }
// });


app.get('/contacts', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM contacts');
    res.status(200).json(rows);
}
);

app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
}
);

app.post('/contacts', async (req, res) => {
    const { full_name, email, phone_no } = req.body;
    await db.query('INSERT INTO contacts (full_name, email, phone_no) VALUES (?, ?, ?)', [full_name, email, phone_no]);
    res.status(201).json({ message: 'Contact added successfully' });
}
);


app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, email, phone_no } = req.body;
    await db.query('UPDATE contacts SET full_name = ?, email = ?, phone_no = ? WHERE id = ?', [full_name, email, phone_no, id]);
    res.status(200).send('Contact updated');
}
);

app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const [result] = await db.query("SELECT * FROM contacts WHERE id = ?", [id]);
    
    if (result.length === 0) {
      return res.status(404).send("Contact not found");
    }
    await db.query("DELETE FROM contacts WHERE id = ?", [id]);
    res.status(200).send("Contact deleted successfully");
  });
  


mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "contact_db",
    password: "Adarshpriydarshi"

}).then((connection)=>{
    db = connection;
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
    console.log("DB connected");
})
.catch((err)=>{
    console.log("DB connection failed", err);
});