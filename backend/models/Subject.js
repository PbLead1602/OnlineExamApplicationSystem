const pool = require("../config/db");

class Subject {
  // Get all
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM subjects ORDER BY created_at DESC");
    return rows;
  }

  // Get by ID
  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM subjects WHERE id = ?", [id]);
    return rows[0];
  }

  // Create
  static async create({ name, description }) {
    const [result] = await pool.query(
      "INSERT INTO subjects (name, description) VALUES (?, ?)",
      [name, description]
    );
    return { id: result.insertId, name, description };
  }

  // Update
  static async update(id, { name, description }) {
    await pool.query(
      "UPDATE subjects SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
    return { id, name, description };
  }

  // Delete
  static async delete(id) {
    await pool.query("DELETE FROM subjects WHERE id = ?", [id]);
    return true;
  }
}

module.exports = Subject;
