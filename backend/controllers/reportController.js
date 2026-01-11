const db = require("../config/db");

// 🏆 GET ALL RESULTS (Table View)
exports.getAllResults = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ea.id AS attempt_id,
        u.username, 
        e.title AS exam_title, 
        ea.total_score AS score, 
        ea.created_at AS attempt_date 
      FROM exam_attempts ea
      JOIN users u ON ea.user_id = u.id
      JOIN exams e ON ea.exam_id = e.id
      ORDER BY ea.created_at DESC
    `;
    const [rows] = await db.query(sql); 
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📊 GET PERFORMANCE STATS (Chart View)
const db = require("../config/db");

exports.getPerformanceStats = async (req, res) => {
  try {
    // 1. Chart Data: Average Scores per Exam
    const [performanceRows] = await db.query(`
      SELECT e.title as name, AVG(ea.total_score) as avgScore 
      FROM exams e
      JOIN exam_attempts ea ON e.id = ea.exam_id
      GROUP BY e.id
    `);

    // 2. Summary Stats: Count Pass/Fail, Students, Exams, and Questions
    const [[passFail]] = await db.query(`
      SELECT 
        SUM(CASE WHEN total_score >= 50 THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN total_score < 50 THEN 1 ELSE 0 END) as failed
      FROM exam_attempts
    `);

    const [[counts]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as totalStudents,
        (SELECT COUNT(*) FROM exams) as totalExams,
        (SELECT COUNT(*) FROM questions) as totalQuestions
    `);

    res.json({
      performance: performanceRows,
      summary: {
        passed: passFail.passed || 0,
        failed: passFail.failed || 0,
        totalStudents: counts.totalStudents || 0,
        totalExams: counts.totalExams || 0,
        totalQuestions: counts.totalQuestions || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats: " + err.message });
  }
};

// 🔍 NEW: GET SPECIFIC ATTEMPT DETAIL (Drill-down)
exports.getAttemptDetail = async (req, res) => {
  const { attemptId } = req.params;
  try {
    const sql = `
      SELECT 
        q.question_text, 
        q.correct_option AS correct_answer,
        sa.selected_option AS student_answer,
        CASE WHEN q.correct_option = sa.selected_option THEN 1 ELSE 0 END AS is_correct
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      WHERE sa.attempt_id = ?
    `;
    const [rows] = await db.query(sql, [attemptId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};