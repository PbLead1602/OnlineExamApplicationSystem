const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");
const { protect, authorize } = require("../middleware/authMiddleware");

// ADMIN
router.post(
  "/:subject_id/topic",
  protect,
  authorize("ADMIN"),
  topicController.createTopic
);

router.put(
  "/topic/:id",
  protect,
  authorize("ADMIN"),
  topicController.updateTopic
);

router.delete(
  "/topic/:id",
  protect,
  authorize("ADMIN"),
  topicController.deleteTopic
);

// SHARED
router.get(
  "/:subject_id/topic",
  protect,
  topicController.getTopicsBySubject
);

module.exports = router;
