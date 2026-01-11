const express = require("express");
const router = express.Router();
const reportCtrl = require("../controllers/reportController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Both modules use this router
router.get("/reports/all-results", verifyToken, isAdmin, reportCtrl.getAllResults);
router.get("/reports/performance", verifyToken, isAdmin, reportCtrl.getPerformanceStats);

module.exports = router;