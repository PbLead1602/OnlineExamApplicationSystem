const express = require("express");
const router = express.Router();
const controller = require("../controllers/examsubjectController");

router.post("/:exam_id/subjects", controller.addSubjectToExam);
router.get("/:exam_id/subjects", controller.getSubjectsForExam);
router.delete("/:exam_id/subjects", controller.removeSubjectFromExam);

module.exports = router;
