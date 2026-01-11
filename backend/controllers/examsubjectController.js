const ExamSubject = require("../models/ExamSubject");

exports.addSubjectToExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { subject_id, duration_minutes, exam_day } = req.body;

    const record = await ExamSubject.add(
      exam_id,
      subject_id,
      duration_minutes,
      exam_day
    );

    res.json({ success: true, record });
  } catch (error) {
    console.error("Add subject error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubjectsForExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const subjects = await ExamSubject.findByExam(exam_id);

    res.json({ success: true, subjects });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeSubjectFromExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { subject_id } = req.body;

    await ExamSubject.remove(exam_id, subject_id);

    res.json({ success: true, message: "Subject removed from exam" });
  } catch (error) {
    console.error("Remove subject error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
