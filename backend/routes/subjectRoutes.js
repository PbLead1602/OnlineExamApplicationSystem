const express = require("express");
const router = express.Router();
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Only admin can manage subjects
router.get("/", protect, authorize("admin"), getSubjects);
router.get("/:id", protect, authorize("admin"), getSubject);
router.post("/", protect, authorize("admin"), createSubject);
router.put("/:id", protect, authorize("admin"), updateSubject);
router.delete("/:id", protect, authorize("admin"), deleteSubject);

module.exports = router;
