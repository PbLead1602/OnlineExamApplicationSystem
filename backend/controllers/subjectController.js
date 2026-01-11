const Subject = require("../models/Subject");

// @desc    Get all subjects
// @route   GET /api/subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.getAll();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const newSubject = await Subject.create({ name, description });
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
exports.updateSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Subject.update(req.params.id, { name, description });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
exports.deleteSubject = async (req, res) => {
  try {
    await Subject.delete(req.params.id);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};