const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController"); 
// FIX: Use the actual names from your middleware file
const { protect, authorize } = require("../middleware/authMiddleware");

// Route definitions using the correct middleware names
// We use authorize("admin") to replace the old isAdmin
router.get("/students", protect, authorize("admin"), userCtrl.getStudents);
router.post("/add", protect, authorize("admin"), userCtrl.addStudent);
router.put("/:id", protect, authorize("admin"), userCtrl.updateStudent);
router.delete("/:id", protect, authorize("admin"), userCtrl.deleteUser);

module.exports = router;