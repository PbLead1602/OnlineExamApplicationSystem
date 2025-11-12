import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamForm = ({ exam, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (exam) {
      setTitle(exam.title);
      setDescription(exam.description);
      setDate(exam.date);
      setDuration(exam.duration);
    } else {
      setTitle("");
      setDescription("");
      setDate("");
      setDuration("");
    }
  }, [exam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examData = { title, description, date, duration };

    try {
      if (exam) {
        await axios.put(`/api/exams/${exam.id}`, examData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post("/api/exams", examData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving exam", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exam-form">
      <div className="mb-3">
        <label className="form-label text-light">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter exam title"
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-light">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter exam description"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label text-light">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label text-light">Duration (in minutes)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            placeholder="e.g., 60"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-warning">
        {exam ? "Update Exam" : "Create Exam"}
      </button>
    </form>
  );
};

export default ExamForm;
