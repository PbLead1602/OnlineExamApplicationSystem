// frontend/src/pages/Questions.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionModal from "../components/QuestionModal";
import "./Questions.css";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // question for edit/view
  const [modalMode, setModalMode] = useState(null); // "add"|"edit"|"view"|"delete"
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const token = localStorage.getItem("token");

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("/api/subjects", { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data);
    } catch (err) {
      console.error("fetchSubjects error", err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/questions", {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: search || undefined, subject_id: filterSubject || undefined },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("fetchQuestions error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubjects();
      fetchQuestions();
    }
    // eslint-disable-next-line
  }, []);

  // Auto-search / filter with small debounce
  useEffect(() => {
    const t = setTimeout(() => fetchQuestions(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, filterSubject]);

  const openAdd = () => {
    setSelected(null);
    setModalMode("add");
  };
  const openEdit = (q) => {
    setSelected(q);
    setModalMode("edit");
  };
  const openView = (q) => {
    setSelected(q);
    setModalMode("view");
  };
  const openDelete = (q) => {
    setSelected(q);
    setModalMode("delete");
  };

  const onModalClose = (didChange) => {
    setModalMode(null);
    setSelected(null);
    if (didChange) fetchQuestions();
  };

  return (
    <div className="questions-page">
      <div className="overlay" />
      <div className="container questions-container">
        <div className="text-center mb-4">
          <h1 className="exam-heading display-5 fw-bold">✏️ Manage Questions</h1>
          <p className="text-light">Create, edit and manage questions.</p>
        </div>

        <div className="glass-card mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2 align-items-center">
            <input className="form-control" placeholder="Search text..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="form-control" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button className="admin-btn" onClick={fetchQuestions}>Search</button>
            <button className="btn btn-outline-light" onClick={() => { setSearch(""); setFilterSubject(""); fetchQuestions(); }}>Reset</button>
          </div>
          <div>
            <button className="btn btn-warning" onClick={openAdd}>+ Add Question</button>
          </div>
        </div>

        <div className="glass-card">
          {loading ? <p className="text-light">Loading...</p> :
            (questions.length === 0 ? <p className="text-light">No questions found.</p> :
              <div className="list-group">
                {questions.map(q => (
                  <div key={q.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-warning">{q.subject_name || "—"}</h6>
                        <p className="mb-1">{q.question_text}</p>
                        <small className="text-muted">Marks: {q.marks}</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-light" onClick={() => openView(q)}>View</button>
                        <button className="btn btn-sm btn-outline-light" onClick={() => openEdit(q)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => openDelete(q)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {modalMode && (
        <QuestionModal
          mode={modalMode}
          question={selected}
          subjects={subjects}
          token={token}
          onClose={onModalClose}
        />
      )}
    </div>
  );
};

export default Questions;
