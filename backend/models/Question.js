const db = require('../config/db');

const Question = {
  create: async (data) => {
    const {
      subject_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks = 1 // Default to 1 if not provided
    } = data;

    // Debug log to help identify undefined inputs
    console.log("CREATE QUESTION INPUT:", {
      subject_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks
    });

    const sql = `INSERT INTO questions 
      (subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, marks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      subject_id ?? null,
      question_text ?? null,
      option_a ?? null,
      option_b ?? null,
      option_c ?? null,
      option_d ?? null,
      correct_option ?? null,
      marks ?? 1
    ]);

    return result;
  },

  findAll: async () => {
    const [rows] = await db.execute(`
      SELECT q.*, s.name AS subject_name 
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      ORDER BY q.id DESC
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM questions WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const {
      subject_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks
    } = data;

    const sql = `UPDATE questions 
      SET subject_id=?, question_text=?, option_a=?, option_b=?, option_c=?, option_d=?, correct_option=?, marks=?
      WHERE id=?`;

    const [result] = await db.execute(sql, [
      subject_id,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks,
      id
    ]);

    return result;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM questions WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Question;
