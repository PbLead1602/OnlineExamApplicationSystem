// frontend/src/components/QuestionForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionForm = ({ question, subjects, onSuccess }) => {
  const [form, setForm] = useState({
    subject_id: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    marks: 1,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (question) {
      setForm({
        subject_id: question.subject_id,
        question_text: question.question_text || "",
        option_a: question.option_a || "",
        option_b: question.option_b || "",
        option_c: question.option_c || "",
        option_d: question.option_d || "",
        correct_option: question.correct_option || "A",
        marks: question.marks || 1,
      });
    } else {
      setForm((f) => ({ ...f, subject_id: subjects?.[0]?.id || "" }));
    }
  }, [question, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      if (question) {
        await axios.put(`/api/questions/${question.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/questions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error saving question");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-2">
        <label className="form-label text-white">Subject</label>
        <select
          className="form-control"
          name="subject_id"
          value={form.subject_id}
          onChange={handleChange}
          required
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label text-white">Question</label>
        <textarea
          className="form-control"
          name="question_text"
          value={form.question_text}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-2">
          <input
            className="form-control"
            name="option_a"
            value={form.option_a}
            onChange={handleChange}
            placeholder="Option A"
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            className="form-control"
            name="option_b"
            value={form.option_b}
            onChange={handleChange}
            placeholder="Option B"
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            className="form-control"
            name="option_c"
            value={form.option_c}
            onChange={handleChange}
            placeholder="Option C"
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            className="form-control"
            name="option_d"
            value={form.option_d}
            onChange={handleChange}
            placeholder="Option D"
            required
          />
        </div>
      </div>

      <div className="row align-items-end">
        <div className="col-md-4 mb-2">
          <label className="form-label text-white">Correct Option</label>
          <select
            name="correct_option"
            className="form-control"
            value={form.correct_option}
            onChange={handleChange}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <label className="form-label text-white">Marks</label>
          <input
            type="number"
            name="marks"
            className="form-control"
            value={form.marks}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="col-md-4 mb-2">
          <button type="submit" className="admin-btn w-100">
            {question ? "Update Question" : "Add Question"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
