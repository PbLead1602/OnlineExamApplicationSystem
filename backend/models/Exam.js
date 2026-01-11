// backend/models/Exam.js
const pool = require("../config/db");

// Get all exams (admin)
exports.findAll = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM exams ORDER BY created_at DESC"
  );
  return rows;
};

// Get exam by ID
exports.getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM exams WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Update exam metadata (NOT questions)
exports.update = async (id, { title, description, date, duration }) => {
  const [result] = await pool.query(
    `UPDATE exams 
     SET title = ?, description = ?, date = ?, duration = ?
     WHERE id = ?`,
    [title, description, date, duration, id]
  );
  return result;
};

// Delete exam (cascade should delete exam_questions)
exports.delete = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM exams WHERE id = ?",
    [id]
  );
  return result;
};

// Exams available for students
// Available for students (Removed 'status' column check since it's missing in your DB)
exports.getAvailableForStudent = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM exams ORDER BY date DESC"
  );
  return rows;
};
