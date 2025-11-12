// backend/models/contactModel.js
const db = require("../config/db");

async function createMessage(name, email, message) {
  const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  const [result] = await db.execute(sql, [name, email, message]);
  return result;  // result.insertId available
}

module.exports = { createMessage };
