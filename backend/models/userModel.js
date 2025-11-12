// we’ll directly use queries instead of ORM for now
const pool = require("../config/db");

const User = {
  async create(name, email, hashedPassword, role = "student") {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }
};

module.exports = User;
