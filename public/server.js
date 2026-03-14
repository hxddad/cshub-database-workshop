const express = require("express");
const sql = require("mssql");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

let pool;

async function connectDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log("Connected to Azure SQL Database");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

connectDB();

app.post("/submit", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  try {
    await pool.request()
      .input("name", sql.NVarChar(100), name)
      .input("email", sql.NVarChar(150), email)
      .input("message", sql.NVarChar(255), message)
      .query(`
        INSERT INTO workshop_submissions (name, email, message)
        VALUES (@name, @email, @message)
      `);

    res.send("Submission successful.");
  } catch (err) {
    console.error("Insert failed:", err.message);
    res.status(500).send("Failed to save submission.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});