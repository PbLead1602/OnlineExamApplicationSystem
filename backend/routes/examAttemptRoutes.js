const express = require("express");
const router = express.Router();

const {
  startExam,
  submitExam,
  getAttemptQuestions,
  saveAnswer,
  getResult
} = require("../controllers/examAttemptController");

const { protect, authorize } = require("../middleware/authMiddleware");

// STUDENT ONLY ROUTES
router.post(
  "/start/:examId",
  protect,
  authorize("student"),
  startExam
);

router.get(
  "/:attemptId/questions",
  protect,
  authorize("student"),
  getAttemptQuestions
);


router.post(
  "/submit/:attemptId",
  protect,
  authorize("student"),
  submitExam
);

router.post(
  "/:attemptId/answer",
  protect,
  authorize("student"),
  saveAnswer
);

router.get(
  "/result/:attemptId",
  protect,
  authorize("student"),
  getResult
);


module.exports = router;
