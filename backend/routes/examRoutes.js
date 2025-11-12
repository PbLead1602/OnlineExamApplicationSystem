// backend/routes/examRoutes.js
const express = require("express");
const router = express.Router();
const { createExam, getAllExams, getExamById, updateExam, deleteExam } = require("../controllers/examController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Only Admins can manage exams
router.post("/", protect, authorize("admin"), createExam);
router.get("/", protect, authorize("admin"), getAllExams);
router.get("/:id", protect, authorize("admin"), getExamById);
router.put("/:id", protect, authorize("admin"), updateExam);
router.delete("/:id", protect, authorize("admin"), deleteExam);

module.exports = router;
