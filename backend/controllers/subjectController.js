const Subject = require("../models/Subject");

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.getAll();
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

// Get single subject by ID
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.getById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ message: "Error fetching subject" });
  }
};

// Create subject
exports.createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const subject = await Subject.create({ name, description });
    res.status(201).json(subject);
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ message: "Error creating subject" });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const subject = await Subject.getById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const updated = await Subject.update(req.params.id, { name, description });
    res.json(updated);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ message: "Error updating subject" });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.getById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Subject.delete(req.params.id);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ message: "Error deleting subject" });
  }
};
