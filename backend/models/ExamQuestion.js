const pool = require("../config/db");

class ExamQuestion {
  static async add(exam_id, question_id, topic_id = null, sequence = null, marks = null) {
    const [result] = await pool.query(
      "INSERT INTO exam_questions (exam_id, question_id, topic_id, sequence, marks) VALUES (?, ?, ?, ?, ?)",
      [exam_id, question_id, topic_id, sequence, marks]
    );
    return { id: result.insertId, exam_id, question_id, topic_id, sequence, marks };
  }

  static async findByExam(exam_id) {
    const [rows] = await pool.query(
      `SELECT 
        eq.id AS exam_question_id,
        eq.exam_id,
        eq.question_id,
        eq.marks AS exam_question_marks,
        eq.sequence,
        q.question_text, 
        q.options,             -- THIS WAS MISSING
        q.correct_options, 
        s.name AS subject_name, 
        t.name AS topic_name
       FROM exam_questions eq
       LEFT JOIN questions q ON eq.question_id = q.id
       LEFT JOIN subjects s ON q.subject_id = s.id
       LEFT JOIN topics t ON eq.topic_id = t.id
       WHERE eq.exam_id = ?
       ORDER BY COALESCE(eq.sequence, eq.id) ASC`,
      [exam_id]
    );
    return rows;
}

  static async remove(exam_id, question_id) {
    const [result] = await pool.query("DELETE FROM exam_questions WHERE exam_id = ? AND question_id = ?", [
      exam_id,
      question_id,
    ]);
    return result;
  }

  static async update(id, { sequence, marks }) {
    await pool.query("UPDATE exam_questions SET sequence = ?, marks = ? WHERE id = ?", [sequence, marks, id]);
    return { id, sequence, marks };
  }
}

module.exports = ExamQuestion;
