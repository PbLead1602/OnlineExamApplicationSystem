const pool = require("../config/db");

class ExamAttempt {
  static async create({ exam_id, user_id, duration_seconds = null }) {
    const [result] = await pool.query(
      "INSERT INTO exam_attempts (exam_id, user_id, duration_seconds) VALUES (?, ?, ?)",
      [exam_id, user_id, duration_seconds]
    );
    return { id: result.insertId, exam_id, user_id, duration_seconds };
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM exam_attempts WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByExamAndUser(exam_id, user_id) {
    const [rows] = await pool.query("SELECT * FROM exam_attempts WHERE exam_id = ? AND user_id = ? ORDER BY created_at DESC", [
      exam_id,
      user_id,
    ]);
    return rows;
  }

  static async findActive(exam_id, user_id) {
  const [rows] = await pool.query(
    "SELECT * FROM exam_attempts WHERE exam_id = ? AND user_id = ? AND status='in_progress' LIMIT 1",
    [exam_id, user_id]
  );
  return rows[0];
}


  static async finish(id, { finished_at = null, status = 'submitted', total_score = null, raw_score = null }) {
    await pool.query("UPDATE exam_attempts SET finished_at = IFNULL(?, NOW()), status = ?, total_score = ?, raw_score = ? WHERE id = ?", [
      finished_at,
      status,
      total_score,
      raw_score,
      id,
    ]);
    return this.getById(id);
  }
}

module.exports = ExamAttempt;
