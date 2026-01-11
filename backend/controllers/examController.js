const db = require("../config/db");
const Exam = require("../models/Exam");

/**
 * GET ALL EXAMS (ADMIN) - Updated with Subject Name Join
 */
exports.getAllExams = async (req, res) => {
  try {
    // We use the promise-based query to keep it consistent with your other code
    const sql = `
      SELECT e.*, s.name as subject_name 
      FROM exams e 
      LEFT JOIN subjects s ON e.subject_id = s.id 
      ORDER BY e.date DESC
    `;
    
    const [exams] = await db.query(sql);
    res.json(exams);
  } catch (err) {
    console.error("Error in getAllExams:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * CREATE EXAM WITH QUESTIONS
 */
exports.createExamWithQuestions = async (req, res) => {
  console.log("Request Body Received:", req.body);

  const { title, description, date, duration, subject_Id, question_Ids } = req.body;

  if (!title || !duration || !subject_Id || !Array.isArray(question_Ids)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payload: Ensure title, duration, subjectId, and question_Ids are present."
    });
  }

  if (question_Ids.length < 5) {
    return res.status(400).json({ success: false, message: "Minimum 5 questions required." });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [examResult] = await conn.query(
      `INSERT INTO exams (title, description, date, duration, subject_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, date, duration, subject_Id, req.user.id]
    );

    const examId = examResult.insertId;

    for (const qid of question_Ids) {
      await conn.query(
        "INSERT INTO exam_questions (exam_id, question_id) VALUES (?, ?)",
        [examId, qid]
      );
    }

    await conn.commit();
    res.status(201).json({ success: true, message: "Exam created", examId });
  } catch (err) {
    await conn.rollback();
    console.error("Transaction Error:", err);
    res.status(500).json({ success: false, message: "DB Error: " + err.message });
  } finally {
    conn.release();
  }
};

/**
 * GET SINGLE EXAM
 */
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.getById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE EXAM METADATA ONLY
 */
exports.updateExam = async (req, res) => {
  try {
    await Exam.update(req.params.id, req.body);
    res.json({ success: true, message: "Exam updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE EXAM
 */
exports.deleteExam = async (req, res) => {
  try {
    await Exam.delete(req.params.id);
    res.json({ success: true, message: "Exam deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * STUDENT – AVAILABLE EXAMS
 */
exports.getAvailableExamsForStudent = async (req, res) => {
  try {
    const exams = await Exam.getAvailableForStudent();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};