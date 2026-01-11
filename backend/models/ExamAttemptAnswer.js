const pool = require("../config/db");

class ExamAttemptAnswer {
  static async save(attempt_id, question_id, answerJson, is_correct = 0, marks_obtained = 0) {
    // Upsert style: if an answer exists for attempt_id+question_id, update; otherwise insert.
    const [existing] = await pool.query("SELECT id FROM exam_attempt_answers WHERE attempt_id = ? AND question_id = ?", [
      attempt_id,
      question_id,
    ]);
    if (existing.length > 0) {
      const id = existing[0].id;
      await pool.query(
        "UPDATE exam_attempt_answers SET answer = ?, is_correct = ?, marks_obtained = ? WHERE id = ?",
        [JSON.stringify(answerJson), is_correct ? 1 : 0, marks_obtained, id]
      );
      return { id, attempt_id, question_id, answer: answerJson, is_correct, marks_obtained };
    } else {
      const [result] = await pool.query(
        "INSERT INTO exam_attempt_answers (attempt_id, question_id, answer, is_correct, marks_obtained) VALUES (?, ?, ?, ?, ?)",
        [attempt_id, question_id, JSON.stringify(answerJson), is_correct ? 1 : 0, marks_obtained]
      );
      return { id: result.insertId, attempt_id, question_id, answer: answerJson, is_correct, marks_obtained };
    }
  }

  static async findByAttempt(attempt_id) {
    const [rows] = await pool.query("SELECT * FROM exam_attempt_answers WHERE attempt_id = ?", [attempt_id]);
    return rows;
  }
}

module.exports = ExamAttemptAnswer;
