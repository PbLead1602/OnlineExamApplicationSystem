// backend/models/Exam.js
const pool = require("../config/db"); // your mysql2 promise pool

// Create exam
exports.create = async ({ title, description, date, duration, created_by }) => {
  const [result] = await pool.query(
    "INSERT INTO exams (title, description, date, duration, created_by) VALUES (?, ?, ?, ?, ?)",
    [title, description, date, duration, created_by]
  );
  return { id: result.insertId, title, description, date, duration, created_by };
};

// Get all exams
exports.findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM exams ORDER BY date DESC");
  return rows;
};

// Get exam by ID
exports.getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM exams WHERE id = ?", [id]);
  return rows;
};

// Update exam
exports.update = async (id, { title, description, date, duration }) => {
  const [result] = await pool.query(
    "UPDATE exams SET title = ?, description = ?, date = ?, duration = ? WHERE id = ?",
    [title, description, date, duration, id]
  );
  return result;
};

// Delete exam
exports.delete = async (id) => {
  const [result] = await pool.query("DELETE FROM exams WHERE id = ?", [id]);
  return result;
};
