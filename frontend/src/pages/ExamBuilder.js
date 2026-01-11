import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css"; // Ensure this uses your shared glass theme

const AdminCreateExam = ({ editExamId = null }) => {
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState({ title: "", description: "", date: "", duration: "" });
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState(new Set());

  useEffect(() => {
    axios.get("/api/subjects", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data)).catch(console.error);
  }, [token]);

  const loadQuestions = async (sid) => {
    const res = await axios.get("/api/questions", {
      headers: { Authorization: `Bearer ${token}` },
      params: { subject_id: sid }
    });
    setQuestions(res.data);
  };

  const toggleQuestion = (id) => {
    const copy = new Set(selectedQ);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedQ(copy);
  };

  const publishExam = async () => {
    if (selectedQ.size < 5) return alert("Minimum 5 questions required");
    const payload = { ...exam, subject_Id: Number(subjectId), question_Ids: Array.from(selectedQ) };
    try {
      await axios.post("/api/exams", payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Exam published successfully");
      window.location.href = "/admin/exams";
    } catch (err) { alert("Publish failed"); }
  };

  return (
    <div className="admin-page">
      <div className="container admin-container">
        <div className="admin-glass-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="admin-heading mb-0">{editExamId ? "Edit Exam" : "Create New Exam"}</h2>
            <span className="badge bg-warning text-dark">Step {step} of 4</span>
          </div>

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="admin-list-item p-4">
              <input placeholder="Exam Title" className="form-control bg-dark text-white border-secondary mb-3"
                onChange={e => setExam({ ...exam, title: e.target.value })} />
              <textarea placeholder="Description" className="form-control bg-dark text-white border-secondary mb-3"
                onChange={e => setExam({ ...exam, description: e.target.value })} />
              <div className="row">
                <div className="col-md-6">
                  <input type="date" className="form-control bg-dark text-white border-secondary mb-3"
                    onChange={e => setExam({ ...exam, date: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <input type="number" placeholder="Duration (min)" className="form-control bg-dark text-white border-secondary mb-3"
                    onChange={e => setExam({ ...exam, duration: e.target.value })} />
                </div>
              </div>
              <button className="admin-btn-gold w-100" onClick={() => setStep(2)}>Next Step →</button>
            </div>
          )}

          {/* STEP 2: Subject Selection */}
          {step === 2 && (
            <div className="admin-list-item p-4 text-center">
              <h5 className="text-white mb-3">Select Subject</h5>
              <select className="form-select bg-dark text-white border-secondary mb-4"
                value={subjectId} onChange={(e) => { setSubjectId(e.target.value); loadQuestions(e.target.value); }}>
                <option value="">Choose Subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button className="admin-btn-gold w-100" onClick={() => setStep(3)}>Next: Select Questions →</button>
            </div>
          )}

          {/* STEP 3: Question Selection */}
          {step === 3 && (
            <div>
              <div className="d-flex justify-content-between mb-3">
                 <p className="text-white-50">Selected: {selectedQ.size}</p>
                 <button className="btn btn-sm btn-outline-warning" onClick={() => {
                    const ids = questions.slice(0, 5).map(q => q.id);
                    setSelectedQ(new Set(ids));
                 }}>Auto-pick 5</button>
              </div>
              <div className="overflow-auto" style={{maxHeight: '400px'}}>
                {questions.map(q => (
                  <div key={q.id} className="admin-list-item d-flex align-items-center">
                    <input type="checkbox" className="form-check-input me-3" 
                      checked={selectedQ.has(q.id)} onChange={() => toggleQuestion(q.id)} />
                    <label className="text-white mb-0">{q.question_text}</label>
                  </div>
                ))}
              </div>
              <button className="admin-btn-gold w-100 mt-3" onClick={() => setStep(4)}>Preview Exam →</button>
            </div>
          )}

          {/* STEP 4: Preview & Publish */}
          {step === 4 && (
            <div className="admin-list-item p-4">
              <h4 className="text-warning border-bottom border-secondary pb-2">Exam Preview</h4>
              <p className="mt-3"><b>Title:</b> {exam.title}</p>
              <p><b>Duration:</b> {exam.duration} Minutes</p>
              <p><b>Questions:</b> {selectedQ.size} Selected</p>
              <button className="btn btn-success w-100 py-3 mt-4 fw-bold" onClick={publishExam}>PUBLISH EXAM NOW</button>
              <button className="btn btn-link text-white-50 w-100 mt-2" onClick={() => setStep(1)}>Go Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateExam;