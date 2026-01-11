const ExamAttempt = require("../models/ExamAttempt");
const ExamAttemptAnswer = require("../models/ExamAttemptAnswer");
const pool = require("../config/db");

/* ================= START EXAM ================= */
exports.startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const active = await ExamAttempt.findActive(examId, userId);
    if (active) return res.json({ attemptId: active.id });

    const attempt = await ExamAttempt.create({ exam_id: examId, user_id: userId });
    res.status(201).json({ attemptId: attempt.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start exam" });
  }
};

/* ================= SAVE ANSWER ================= */
exports.saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { question_id, selected_option } = req.body;

    await ExamAttemptAnswer.save(
      attemptId,
      question_id,
      { selected: selected_option },
      null,
      0
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save answer" });
  }
};

/* ================= SUBMIT EXAM ================= */
exports.submitExam = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const answers = await ExamAttemptAnswer.findByAttempt(attemptId);
    let totalScore = 0;

    for (const a of answers) {
      const [[q]] = await pool.query(
        "SELECT correct_options, marks FROM questions WHERE id=?",
        [a.question_id]
      );

      // Safe parse student answer
      let student = null;
      try {
        const parsed = typeof a.answer === 'string' ? JSON.parse(a.answer) : a.answer;
        student = parsed?.selected || null;
      } catch { student = null; }

      // Safe parse correct answer
      let correct = null;
      try {
        const parsedCorrect = typeof q.correct_options === "string" ? JSON.parse(q.correct_options) : q.correct_options;
        correct = parsedCorrect[0] || null;
      } catch { correct = null; }

      const isCorrect = student && student === correct;
      const marks = isCorrect ? Number(q.marks) : 0;
      totalScore += marks;

      await ExamAttemptAnswer.save(attemptId, a.question_id, { selected: student }, isCorrect, marks);
    }

    await ExamAttempt.finish(attemptId, { status: "submitted", total_score: totalScore, raw_score: totalScore });
    res.json({ success: true, totalScore });
  } catch (err) {
    console.error("Submit Exam Error:", err);
    res.status(500).json({ message: "Failed to submit exam" });
  }
};

/* ================= GET RESULT ================= */
/* ================= GET RESULT ================= */
/* ================= GET RESULT ================= */
/* ================= GET RESULT (Updated to show ALL questions) ================= */
exports.getResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // 1. First, get the exam_id for this attempt
    const [[attemptInfo]] = await pool.query(
      "SELECT exam_id, total_score, status FROM exam_attempts WHERE id = ?",
      [attemptId]
    );

    if (!attemptInfo) return res.status(404).json({ message: "Attempt not found" });

    // 2. Fetch ALL questions linked to this exam, joining with the student's answers
    const [rows] = await pool.query(`
      SELECT 
        q.id, q.question_text, q.options, q.correct_options, q.marks as total_marks,
        a.answer, a.is_correct, a.marks_obtained,
        e.title as exam_title,
        s.name as subject_name
      FROM exam_questions eq
      JOIN questions q ON eq.question_id = q.id
      JOIN exams e ON e.id = eq.exam_id
      LEFT JOIN subjects s ON s.id = e.subject_id
      LEFT JOIN exam_attempt_answers a ON a.question_id = q.id AND a.attempt_id = ?
      WHERE eq.exam_id = ?
      ORDER BY eq.sequence ASC
    `, [attemptId, attemptInfo.exam_id]);

    const attempt = {
      ...attemptInfo,
      exam_title: rows[0]?.exam_title || "Exam Result",
      subject_name: rows[0]?.subject_name || "General"
    };

    const formatted = rows.map(r => {
      // Safe parse student answer
      let studentSelected = null;
      try {
        const parsed = typeof r.answer === "string" ? JSON.parse(r.answer) : r.answer;
        studentSelected = parsed?.selected || null;
      } catch { 
        studentSelected = null; 
      }

      // Safe parse options
      let options = [];
      try {
        options = typeof r.options === "string" ? JSON.parse(r.options) : r.options;
      } catch { options = []; }

      // Safe parse correct answer
      let correctAnswer = null;
      try {
        const parsedCorrect = typeof r.correct_options === "string" 
          ? JSON.parse(r.correct_options) 
          : r.correct_options;
        correctAnswer = Array.isArray(parsedCorrect) ? parsedCorrect[0] : parsedCorrect;
      } catch {
        correctAnswer = r.correct_options;
      }

      return {
        question_id: r.id,
        question_text: r.question_text,
        options: options,
        correctAnswer: correctAnswer,
        selectedAnswer: studentSelected,
        is_correct: !!r.is_correct,
        marks_obtained: Number(r.marks_obtained || 0),
        total_marks: Number(r.total_marks || 0)
      };
    });

    res.json({ success: true, attempt, answers: formatted });
  } catch (err) {
    console.error("Get Result Error:", err);
    res.status(500).json({ message: "Failed to fetch result" });
  }
};
/* ================= GET ATTEMPT QUESTIONS ================= */
/* ================= GET ATTEMPT QUESTIONS ================= */
exports.getAttemptQuestions = async (req, res) => {
  try {
    const { attemptId } = req.params;

    // Modified Query: JOIN with exams table to get the duration
    const [[attemptInfo]] = await pool.query(`
      SELECT ea.id, ea.exam_id, e.duration
      FROM exam_attempts ea
      JOIN exams e ON ea.exam_id = e.id
      WHERE ea.id = ?
    `, [attemptId]);

    if (!attemptInfo) return res.status(404).json({ message: "Attempt not found" });

    const [questions] = await pool.query(`
      SELECT q.id, q.question_text, q.options
      FROM exam_questions eq
      JOIN questions q ON eq.question_id = q.id
      WHERE eq.exam_id = ? ORDER BY eq.sequence
    `, [attemptInfo.exam_id]);

    const [answers] = await pool.query(
      "SELECT question_id, answer FROM exam_attempt_answers WHERE attempt_id = ?", 
      [attemptId]
    );

    const answerMap = {};
    answers.forEach(a => {
      try {
        const parsed = typeof a.answer === 'string' ? JSON.parse(a.answer) : a.answer;
        answerMap[a.question_id] = parsed?.selected || null;
      } catch { answerMap[a.question_id] = null; }
    });

    const formatted = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: typeof q.options === 'string' ? JSON.parse(q.options || "[]") : q.options,
      selectedAnswer: answerMap[q.id] || null
    }));

    // Send the dynamic duration to the frontend
    res.json({ 
      questions: formatted, 
      duration: attemptInfo.duration 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load attempt questions" });
  }
};