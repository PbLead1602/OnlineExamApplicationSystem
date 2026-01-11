const pool = require("../config/db");

class ExamSubject {
  static async add(exam_id, subject_id, duration_minutes = 0, exam_day = null) {
    const [result] = await pool.query(
      "INSERT INTO exam_subjects (exam_id, subject_id, duration_minutes, exam_day) VALUES (?, ?, ?, ?)",
      [exam_id, subject_id, duration_minutes, exam_day]
    );
    return { id: result.insertId, exam_id, subject_id, duration_minutes, exam_day };
  }

  static async findByExam(exam_id) {
    const [rows] = await pool.query(
      "SELECT es.*, s.name AS subject_name FROM exam_subjects es JOIN subjects s ON es.subject_id = s.id WHERE es.exam_id = ? ORDER BY es.id ASC",
      [exam_id]
    );
    return rows;
  }

  static async update(id, { duration_minutes, exam_day }) {
    await pool.query("UPDATE exam_subjects SET duration_minutes = ?, exam_day = ? WHERE id = ?", [
      duration_minutes,
      exam_day,
      id,
    ]);
    return { id, duration_minutes, exam_day };
  }

  static async remove(exam_id, subject_id) {
    const [result] = await pool.query("DELETE FROM exam_subjects WHERE exam_id = ? AND subject_id = ?", [
      exam_id,
      subject_id,
    ]);
    return result;
  }
}

module.exports = ExamSubject;
