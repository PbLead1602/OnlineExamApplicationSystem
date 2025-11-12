const Exam = require("../models/Exam");

exports.createExam = async (req, res) => {
  try {
    let { title, description, date, duration } = req.body;

    if (typeof duration === "string") {
      duration = parseInt(duration.replace(/\D/g, ""), 10);
    }

    const result = await Exam.create({
      title,
      description,
      date,
      duration,
      created_by: req.user.id
    });

    res.status(201).json({ success: true, exam: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.getById(req.params.id);
    if (exam.length === 0) return res.status(404).json({ message: "Exam not found" });
    res.json(exam[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    await Exam.update(req.params.id, req.body);
    res.json({ message: "Exam updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating exam", error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.delete(req.params.id);
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting exam", error: error.message });
  }
};
