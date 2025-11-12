import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionForm from "../components/QuestionForm";
import "./Questions.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editQuestion, setEditQuestion] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error("fetchSubjects error", err);
    }
  };

  // Fetch Questions (handles both all + filtered)
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let res;
      if (search || filterSubject) {
        // Call dedicated search API
        res = await axios.get("/api/questions/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: search, subject_id: filterSubject },
        });
      } else {
        // Default: fetch all
        res = await axios.get("/api/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setQuestions(res.data);
    } catch (err) {
      console.error("fetchQuestions error", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    if (token) {
      fetchSubjects();
      fetchQuestions();
    }
    // eslint-disable-next-line
  }, [token]);

  // Delete Question
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      console.error("delete error", err);
    }
  };

  // Edit Question
  const handleEdit = (q) => {
    setEditQuestion(q);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Form Success → refresh questions
  const handleFormSuccess = () => {
    setEditQuestion(null);
    fetchQuestions();
  };

  return (
    <div className="questions-page">
      <div className="overlay" />
      <div className="container questions-container admin-container">
        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="questions-heading">✏️ Manage Questions</h1>
          <p className="text-light">Create and manage questions per subject.</p>
        </div>

        {/* Add/Edit Form */}
        <div className="glass-card mb-4">
          <h5 className="text-warning mb-3">
            {editQuestion ? "Edit Question" : "Add Question"}
          </h5>
          <QuestionForm
            question={editQuestion}
            subjects={subjects}
            onSuccess={handleFormSuccess}
          />
        </div>

        {/* Search & List */}
        <div className="glass-card mt-4">
          <div className="d-flex mb-3 flex-wrap gap-2">
            <input
              className="form-control"
              placeholder="Search text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-control"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button className="admin-btn" type="button" onClick={fetchQuestions}>
              Search
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => {
                setSearch("");
                setFilterSubject("");
                fetchQuestions();
              }}
            >
              Reset
            </button>
          </div>

          {loading ? (
            <p className="text-light">Loading...</p>
          ) : questions.length === 0 ? (
            <p className="text-light">No questions found.</p>
          ) : (
            <div className="list-group">
              {questions.map((q) => (
                <div key={q.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-warning">{q.subject_name || "—"}</h6>
                      <p className="mb-1">{q.question_text}</p>
                      <div>
                        <small className="text-muted">
                          A: {q.option_a} &nbsp; B: {q.option_b} &nbsp; C: {q.option_c} &nbsp; D: {q.option_d}
                        </small>
                        <br />
                        <small className="text-light">
                          Correct: <strong>{q.correct_option}</strong> • Marks: {q.marks}
                        </small>
                      </div>
                    </div>
                    <div className="text-end d-flex flex-shrink-0">
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(q.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
