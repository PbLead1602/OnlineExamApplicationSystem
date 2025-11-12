// backend/controllers/contactController.js
const { createMessage } = require("../models/contactModel");

const submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("📥 Contact request received:", { name, email, message });

    if (!name || !email || !message) {
      console.warn("⚠️ Missing fields in contact form");
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await createMessage(name, email, message);
    console.log("✅ Contact saved to DB. InsertId:", result.insertId);

    return res.status(201).json({
      message: "✅ Message submitted successfully!",
      id: result.insertId
    });
  } catch (err) {
    console.error("❌ Error in submitMessage:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

module.exports = { submitMessage };
