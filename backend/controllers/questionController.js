// backend/controllers/questionController.js
const Question = require("../models/Question");
const pool = require("../config/db");

// helper validation
const validatePayload = (body) => {
  const { subject_id, question_text, options, correct_options, marks } = body;
  if (!subject_id) return "subject_id is required";
  if (!question_text || question_text.trim() === "") return "question_text is required";
  if (!Array.isArray(options) || options.length < 2) return "At least 2 options are required";
  if (options.length > 7) return "Max 7 options allowed";
  for (const opt of options) {
    if (!opt.label || typeof opt.label !== "string") return "Each option needs a label (A,1,i...)";
    if (!opt.text || opt.text.trim() === "") return "Option text cannot be empty";
  }
  if (!Array.isArray(correct_options) || correct_options.length === 0) return "At least one correct option must be selected";
  // ensure correct_options are subset of option labels
  const labels = options.map((o) => o.label);
  for (const c of correct_options) {
    if (!labels.includes(c)) return `Correct option ${c} is not present in options`;
  }
  if (marks == null || isNaN(parseInt(marks))) return "marks must be a number";
  return null;
};

exports.createQuestion = async (req, res) => {
  try {
    const payload = req.body;
    const err = validatePayload(payload);
    if (err) return res.status(400).json({ message: err });

    // ensure subject exists
    const [sRows] = await pool.query("SELECT id FROM subjects WHERE id = ?", [payload.subject_id]);
    if (sRows.length === 0) return res.status(400).json({ message: "Invalid subject_id" });

    const question = await Question.create(payload);
    res.status(201).json({ message: "Question created", question });
  } catch (err) {
    console.error("createQuestion error:", err);
    res.status(500).json({ message: "Server error creating question", error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const { query, subject_id } = req.query;
    // If query or subject_id provided, use search; else return all
    if (query || subject_id) {
      const results = await Question.search({ query, subject_id });
      return res.json(results);
    }
    const questions = await Question.findAll();
    res.json(questions);
  } catch (err) {
    console.error("getAllQuestions error:", err);
    res.status(500).json({ message: "Server error fetching questions", error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const q = await Question.getById(req.params.id);
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.json(q);
  } catch (err) {
    console.error("getQuestionById error:", err);
    res.status(500).json({ message: "Server error fetching question", error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const payload = req.body;
    const err = validatePayload(payload);
    if (err) return res.status(400).json({ message: err });

    const existing = await Question.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Question not found" });

    // ensure subject exists
    const [sRows] = await pool.query("SELECT id FROM subjects WHERE id = ?", [payload.subject_id]);
    if (sRows.length === 0) return res.status(400).json({ message: "Invalid subject_id" });

    await Question.update(req.params.id, payload);
    const updated = await Question.getById(req.params.id);
    res.json({ message: "Question updated", question: updated });
  } catch (err) {
    console.error("updateQuestion error:", err);
    res.status(500).json({ message: "Server error updating question", error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const existing = await Question.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Question not found" });
    await Question.delete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ message: "Server error deleting question", error: err.message });
  }
};
