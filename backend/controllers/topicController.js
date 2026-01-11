const Topic = require("../models/Topic");

exports.createTopic = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const { name, description } = req.body;

    const topic = await Topic.create({ subject_id, name, description });
    return res.json({ success: true, topic });
  } catch (err) {
    console.error("Create Topic Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTopicsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const topics = await Topic.findAllBySubject(subject_id);
    return res.json({ success: true, topics });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await Topic.update(id, { name, description });
    return res.json({ success: true, topic: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    await Topic.delete(id);
    return res.json({ success: true, message: "Topic deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
