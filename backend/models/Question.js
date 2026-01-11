// backend/models/Question.js
const pool = require("../config/db");

// Helper function to safely parse JSON or return the object/default
const safeParseJSON = (data) => {
    if (typeof data === 'string' && data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse JSON string:", data, e);
            return [];
        }
    }
    // If it's already an object, or null/undefined, return it or default to []
    return data || [];
}

class Question {
  static async create({ subject_id, question_text, options, correct_options, marks }) {
    // ... (create method is fine as it uses JSON.stringify for insert)
    const [result] = await pool.query(
      `INSERT INTO questions (subject_id, question_text, options, correct_options, marks)
VALUES (?, ?, ?, ?, ?)`,
      [
        subject_id,
        question_text,
        JSON.stringify(options || []),
        JSON.stringify(correct_options || []),
        marks || 1
      ]
    );
    return {
      id: result.insertId,
      subject_id,
      question_text,
      options,
      correct_options,
      marks
    };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT q.id, q.subject_id, q.question_text, q.options, q.correct_options, q.marks, s.name AS subject_name, q.created_at
FROM questions q
LEFT JOIN subjects s ON q.subject_id = s.id
ORDER BY q.created_at DESC`
    );
    
    // Apply safe parsing
    return rows.map((r) => ({
      ...r,
      options: safeParseJSON(r.options),
      correct_options: safeParseJSON(r.correct_options)
    }));
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT q.id, q.subject_id, q.question_text, q.options, q.correct_options, q.marks, s.name AS subject_name, q.created_at
FROM questions q
LEFT JOIN subjects s ON q.subject_id = s.id
WHERE q.id = ?`,
      [id]
    );
    if (!rows[0]) return null;
    const r = rows[0];
    return {
      ...r,
      options: safeParseJSON(r.options),
      correct_options: safeParseJSON(r.correct_options)
    };
  }

  static async search({ query, subject_id }) {
    let sql = `SELECT q.id, q.subject_id, q.question_text, q.options, q.correct_options, q.marks, s.name AS subject_name, q.created_at
FROM questions q LEFT JOIN subjects s ON q.subject_id = s.id WHERE 1=1`;
    // ... (SQL building logic)
    const params = [];
    if (subject_id) {
      sql += ` AND q.subject_id = ?`;
      params.push(subject_id);
    }
    if (query) {
      sql += ` AND (q.question_text LIKE ? OR q.options LIKE ?)`; 
      const term = `%${query}%`;
      params.push(term, term);
    }
    sql += ` ORDER BY q.created_at DESC`;
    const [rows] = await pool.query(sql, params);
    
    // Apply safe parsing
    return rows.map((r) => ({
      ...r,
      options: safeParseJSON(r.options),
      correct_options: safeParseJSON(r.correct_options)
    }));
  }

  static async update(id, { subject_id, question_text, options, correct_options, marks }) {
    // ... (update method is fine as it uses JSON.stringify for insert)
    const [result] = await pool.query(
      `UPDATE questions SET subject_id=?, question_text=?, options=?, correct_options=?, marks=? WHERE id = ?`,
      [subject_id, question_text, JSON.stringify(options || []), JSON.stringify(correct_options || []), marks || 1, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM questions WHERE id = ?`, [id]);
    return result;
  }
}

module.exports = Question;