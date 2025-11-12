// backend/controllers/questionController.js

const Question = require("../models/Question");
const pool = require("../config/db"); // Used for quick lookups (e.g., subject existence check)

/**
 * Validates the required fields for creating or updating a question.
 * @param {object} body - The request body containing question data.
 * @returns {string | null} Error message string if validation fails, otherwise null.
 */
const validatePayload = (body) => {
  const { 
    subject_id, 
    question_text, 
    option_a, 
    option_b, 
    option_c, 
    option_d, 
    correct_option, 
    marks 
  } = body;

  // 1. Basic presence checks
  if (!subject_id) return "subject_id is required";
  if (!question_text || question_text.trim() === "") return "question_text is required";
  if (!option_a || !option_b || !option_c || !option_d) return "All four options (a, b, c, d) are required";

  // 2. Correct option format check
  const validOptions = ["A", "B", "C", "D"];
  if (!validOptions.includes(correct_option)) return `correct_option must be one of ${validOptions.join(", ")}`;

  // 3. Marks check
  // Note: marks might be sent as 0, so check against null/NaN after parsing
  const parsedMarks = parseInt(marks);
  if (marks == null || isNaN(parsedMarks) || parsedMarks < 0) return "marks must be a non-negative number";

  return null;
};

// --- CRUD Operations ---

/**
 * Creates a new question after validating data and checking subject existence.
 */
exports.createQuestion = async (req, res) => {
  try {
    const errMsg = validatePayload(req.body);
    if (errMsg) {
      return res.status(400).json({ message: errMsg });
    }

    const { subject_id } = req.body;

    // Check if the subject exists using the database pool connection
    const [subRows] = await pool.query("SELECT id FROM subjects WHERE id = ?", [subject_id]);
    if (subRows.length === 0) {
      return res.status(400).json({ message: "Invalid subject_id: Subject does not exist." });
    }

    const question = await Question.create(req.body);
    res.status(201).json({ message: "Question successfully created", question });
  } catch (err) {
    console.error("createQuestion error:", err);
    res.status(500).json({ message: "Server error creating question", error: err.message });
  }
};

/**
 * Retrieves all questions.
 */
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (err) {
    console.error("getAllQuestions error:", err);
    res.status(500).json({ message: "Server error fetching questions", error: err.message });
  }
};

/**
 * Retrieves a single question by its ID.
 */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.getById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.error("getQuestionById error:", err);
    res.status(500).json({ message: "Server error fetching question", error: err.message });
  }
};

/**
 * Updates an existing question after validation.
 */
exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const errMsg = validatePayload(req.body);
    if (errMsg) {
      return res.status(400).json({ message: errMsg });
    }

    // 1. Ensure the question being updated exists
    const existingQuestion = await Question.getById(questionId);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 2. Check if the new subject_id is valid
    const [subRows] = await pool.query("SELECT id FROM subjects WHERE id = ?", [req.body.subject_id]);
    if (subRows.length === 0) {
      return res.status(400).json({ message: "Invalid subject_id: Subject does not exist." });
    }

    // 3. Perform the update
    await Question.update(questionId, req.body);
    
    // 4. Fetch the updated record to return
    const updatedQuestion = await Question.getById(questionId);
    res.json({ message: "Question successfully updated", question: updatedQuestion });
  } catch (err) {
    console.error("updateQuestion error:", err);
    res.status(500).json({ message: "Server error updating question", error: err.message });
  }
};

/**
 * Deletes a question by its ID.
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    
    // Ensure question exists before attempting deletion
    const existing = await Question.getById(questionId);
    if (!existing) {
      return res.status(404).json({ message: "Question not found" });
    }

    await Question.delete(questionId);
    res.json({ message: "Question successfully deleted" });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    res.status(500).json({ message: "Server error deleting question", error: err.message });
  }
};

/**
 * Searches questions based on query text and/or subject ID.
 */
exports.searchQuestions = async (req, res) => {
  try {
    // req.query is automatically destructured for query parameters
    const { query, subject_id } = req.query; 
    
    const results = await Question.search({ query, subject_id });
    res.json(results);
  } catch (err) {
    console.error("searchQuestions error:", err);
    res.status(500).json({ message: "Server error searching questions", error: err.message });
  }
};