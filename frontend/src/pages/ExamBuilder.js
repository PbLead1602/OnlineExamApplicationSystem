import React, { useEffect, useState } from "react";
import axios from "axios";
import "./exambuilder.css";

const AdminCreateExam = ({ editExamId = null }) => {
  const token = localStorage.getItem("token");

  // Step control
  const [step, setStep] = useState(1);

  // Exam data
  const [exam, setExam] = useState({
    title: "",
    description: "",
    date: "",
    duration: ""
  });

  // Subject + Questions
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQ, setSelectedQ] = useState(new Set());

  // Load subjects
  useEffect(() => {
    axios
      .get("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setSubjects(res.data))
      .catch(console.error);
  }, [token]);

  // Load questions by subject
  const loadQuestions = async (sid) => {
    const res = await axios.get("/api/questions", {
      headers: { Authorization: `Bearer ${token}` },
      params: { subject_id: sid }
    });
    setQuestions(res.data);
  };

  // Toggle question
  const toggleQuestion = (id) => {
    const copy = new Set(selectedQ);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedQ(copy);
  };

  // Auto-random selection
  const autoSelect = (count = 5) => {
    if (questions.length < count) {
      alert("Not enough questions");
      return;
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const ids = shuffled.slice(0, count).map(q => q.id);
    setSelectedQ(new Set(ids));
  };

  // Publish exam
  const publishExam = async () => {
    if (selectedQ.size < 5) {
      return alert("Minimum 5 questions required");
    }

  const payload = {
    title: exam.title,
    description: exam.description,
    date: exam.date,
    duration: exam.duration,
    subject_Id: Number(subjectId),
    question_Ids: Array.from(selectedQ)
  };


    try {
      await axios.post(
        "/api/exams",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Exam published successfully");
      window.location.href = "/admin/exams";
    } catch (err) {
      alert("Publish failed");
    }
  };

  return (
    <div className="container mt-4 text-white">

      <h2 className="text-warning mb-3">
        {editExamId ? "Edit Exam" : "Create New Exam"}
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card p-4">
          <input placeholder="Title" className="form-control mb-2"
            onChange={e => setExam({ ...exam, title: e.target.value })} />
          <textarea placeholder="Description" className="form-control mb-2"
            onChange={e => setExam({ ...exam, description: e.target.value })} />
          <input type="date" className="form-control mb-2"
            onChange={e => setExam({ ...exam, date: e.target.value })} />
          <input type="number" placeholder="Duration (min)" className="form-control"
            onChange={e => setExam({ ...exam, duration: e.target.value })} />

          <button className="btn btn-warning mt-3" onClick={() => setStep(2)}>
            Next →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card p-4">
          <select className="form-control"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              loadQuestions(e.target.value);
            }}>
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button className="btn btn-warning mt-3" onClick={() => setStep(3)}>
            Next →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card p-4">
          <button className="btn btn-outline-warning mb-2"
            onClick={() => autoSelect(5)}>
            Auto Pick 5 Questions
          </button>

          {questions.map(q => (
            <div key={q.id} className="form-check">
              <input
                type="checkbox"
                checked={selectedQ.has(q.id)}
                onChange={() => toggleQuestion(q.id)}
              />
              <label className="ms-2">{q.question_text}</label>
            </div>
          ))}

          <button className="btn btn-warning mt-3" onClick={() => setStep(4)}>
            Preview →
          </button>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="card p-4">
          <h4 className="text-warning">Exam Preview</h4>
          <p><b>Title:</b> {exam.title}</p>
          <p><b>Questions:</b> {selectedQ.size}</p>

          <button className="btn btn-success" onClick={publishExam}>
            Publish Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCreateExam;
