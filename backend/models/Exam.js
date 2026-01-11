// backend/models/Exam.js
const pool = require("../config/db");

// Updated: Includes Subject Join for the Manage Exams table
exports.findAll = async () => {
  const [rows] = await pool.query(
    `SELECT e.*, s.name as subject_name 
     FROM exams e 
     LEFT JOIN subjects s ON e.subject_id = s.id 
     ORDER BY e.created_at DESC`
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM exams WHERE id = ?",
    [id]
  );
  return rows[0];
};

exports.update = async (id, { title, description, date, duration }) => {
  const [result] = await pool.query(
    `UPDATE exams 
     SET title = ?, description = ?, date = ?, duration = ?
     WHERE id = ?`,
    [title, description, date, duration, id]
  );
  return result;
};

exports.delete = async (id) => {
  // Ensure your MySQL DB has ON DELETE CASCADE on exam_questions table 
  // Otherwise, you'd need to manually delete from exam_questions first.
  const [result] = await pool.query(
    "DELETE FROM exams WHERE id = ?",
    [id]
  );
  return result;
};

exports.getAvailableForStudent = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM exams ORDER BY date DESC"
  );
  return rows;
};