// backend/routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin-only endpoints
router.post("/", protect, authorize("admin"), createQuestion);
router.get("/", protect, authorize("admin"), getAllQuestions);
router.get("/:id", protect, authorize("admin"), getQuestionById);
router.put("/:id", protect, authorize("admin"), updateQuestion);
router.delete("/:id", protect, authorize("admin"), deleteQuestion);

module.exports = router;
