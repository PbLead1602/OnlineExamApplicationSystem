import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./studentStyle.css"; 

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/exams/available")
      .then((res) => setExams(res.data))
      .catch(() => alert("Failed to load exams"));
  }, []);

  // Updated Status Logic
  const getExamStatus = (examDate) => {
    const today = new Date().toISOString().split('T')[0];
    const eDate = new Date(examDate).toISOString().split('T')[0];

    if (eDate < today) return "EXPIRED";
    if (eDate === today) return "AVAILABLE";
    return "UPCOMING";
  };

  const startExam = async (examId) => {
    try {
      const res = await api.post(`/exam-attempt/start/${examId}`);
      navigate(`/attempt/${res.data.attemptId}`);
    } catch (err) {
      alert("Unable to start exam");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="student-page">
      <div className="container student-container">
        <h2 className="mb-4 student-heading fw-bold">Available Exams</h2>

        <div className="row">
          {exams.map((exam) => {
            const status = getExamStatus(exam.date);
            
            return (
              <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
                <div className="student-glass h-100 d-flex flex-column shadow">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="fw-bold student-heading mb-2">{exam.title}</h5>
                    {/* Visual Badge for status */}
                    <span className={`badge ${status === 'EXPIRED' ? 'bg-danger' : status === 'UPCOMING' ? 'bg-info' : 'bg-success'}`}>
                      {status}
                    </span>
                  </div>
                  
                  <p className="student-sub small mb-3">{exam.description || "Official Examination"}</p>
                  <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">📅</span>
                      <span className="student-sub"><strong>Date:</strong> {formatDate(exam.date)}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-2">⏳</span>
                      <span className="student-sub"><strong>Duration:</strong> {exam.duration} mins</span>
                    </div>
                  </div>
                  
                  {/* Dynamic Button based on your requirements */}
                  {status === "AVAILABLE" ? (
                    <button className="btn student-btn w-100 mt-auto py-2" onClick={() => startExam(exam.id)}>
                      Start Exam
                    </button>
                  ) : status === "EXPIRED" ? (
                    <button className="btn btn-outline-danger w-100 mt-auto py-2 disabled" style={{ cursor: "not-allowed" }}>
                      🚫 Exam Expired
                    </button>
                  ) : (
                    <button className="btn btn-outline-light w-100 mt-auto py-2 disabled" style={{ cursor: "not-allowed" }}>
                      🕒 Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {exams.length === 0 && (
          <div className="text-center mt-5">
            <h4 className="student-sub">No exams scheduled.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableExams;