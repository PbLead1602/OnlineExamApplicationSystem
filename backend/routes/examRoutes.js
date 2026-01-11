const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ADMIN ROUTES (Note: Use "admin" lowercase to match your DB)
router.post("/", protect, authorize("admin"), examController.createExamWithQuestions);
router.get("/", protect, authorize("admin"), examController.getAllExams);
router.put("/:id", protect, authorize("admin"), examController.updateExam);
router.delete("/:id", protect, authorize("admin"), examController.deleteExam);

// STUDENT ROUTES
router.get("/available", protect, authorize("student"), examController.getAvailableExamsForStudent);
router.get("/:id", protect, examController.getExamById);

module.exports = router;