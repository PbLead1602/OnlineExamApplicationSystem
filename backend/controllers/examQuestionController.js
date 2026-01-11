const ExamQuestion = require("../models/ExamQuestion");

exports.addQuestionToExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { question_id, topic_id, sequence, marks } = req.body;

    const record = await ExamQuestion.add(
      exam_id,
      question_id,
      topic_id,
      sequence,
      marks
    );

    res.json({ success: true, record });
  } catch (err) {
    console.error("Add question failed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getQuestionsForExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const questions = await ExamQuestion.findByExam(exam_id);
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Get questions failed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeQuestionFromExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { question_id } = req.body;

    await ExamQuestion.remove(exam_id, question_id);

    res.json({ success: true, message: "Question removed" });
  } catch (err) {
    console.error("Remove question failed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
