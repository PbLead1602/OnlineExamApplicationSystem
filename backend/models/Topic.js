const pool = require("../config/db");

class Topic {
  static async create({ subject_id, name, description }) {
    const [result] = await pool.query(
      "INSERT INTO topics (subject_id, name, description) VALUES (?, ?, ?)",
      [subject_id, name, description]
    );
    return { id: result.insertId, subject_id, name, description };
  }

  static async findAllBySubject(subject_id) {
    const [rows] = await pool.query(
      "SELECT * FROM topics WHERE subject_id = ? ORDER BY created_at DESC",
      [subject_id]
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM topics WHERE id = ?", [id]);
    return rows[0];
  }

  static async update(id, { name, description }) {
    await pool.query("UPDATE topics SET name = ?, description = ? WHERE id = ?", [
      name,
      description,
      id,
    ]);
    return { id, name, description };
  }

  static async delete(id) {
    await pool.query("DELETE FROM topics WHERE id = ?", [id]);
    return true;
  }
}

module.exports = Topic;
