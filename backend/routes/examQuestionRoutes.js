const express = require("express");
const router = express.Router();

const controller = require("../controllers/examQuestionController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ADMIN ONLY
router.post(
  "/:exam_id/questions",
  protect,
  authorize("ADMIN"),
  controller.addQuestionToExam
);

router.delete(
  "/:exam_id/questions",
  protect,
  authorize("ADMIN"),
  controller.removeQuestionFromExam
);

// STUDENT + ADMIN (read-only)
router.get(
  "/:exam_id",
  protect,
  controller.getQuestionsForExam
);

module.exports = router;
