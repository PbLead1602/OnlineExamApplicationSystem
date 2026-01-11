import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./studentStyle.css";

const AttemptResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/exam-attempt/result/${attemptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error("Error fetching result:", err);
    } finally {
      setLoading(false);
    }
  }, [attemptId, token]);

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchResult();
  }, [fetchResult, token, navigate]);

  if (loading) return (
    <div className="attempt-page d-flex align-items-center justify-content-center">
      <h4 className="attempt-heading">Generating Detailed Report...</h4>
    </div>
  );

  if (!data) return <div className="attempt-page text-center text-danger"><h4>Result not found.</h4></div>;

  // --- MERGED LOGIC FOR STATISTICS ---
  const totalQuestions = data.answers.length;
  // Checks if selectedAnswer is not null, undefined, or empty string
  const attemptedCount = data.answers.filter(a => a.selectedAnswer !== null && a.selectedAnswer !== "").length;
  const correctCount = data.answers.filter(a => a.is_correct).length;
  const skippedCount = totalQuestions - attemptedCount;

  return (
    <div className="attempt-page">
      <div className="attempt-container container pb-5">
        
        {/* Header with Subject and Title */}
        <div className="attempt-nav-card d-flex justify-content-between align-items-center mb-4 sticky-top">
          <div>
            <h3 className="attempt-heading mb-0">{data.attempt.exam_title || "Exam Result"}</h3>
            <span className="text-warning fw-bold text-uppercase" style={{fontSize: '0.9rem'}}>
              Subject: {data.attempt.subject_name || "General"}
            </span>
          </div>
          <button className="attempt-btn px-4 py-2" onClick={() => navigate("/student-dashboard")}>
            Exit to Dashboard
          </button>
        </div>

        {/* --- ENHANCED SUMMARY CARD --- */}
        <div className="attempt-card mb-5 border-0 shadow-lg">
          <div className="row text-center g-3">
            <div className="col-md-2 border-end border-secondary border-opacity-25">
              <p className="mb-0 text-white-50 small">SCORE</p>
              <h2 className="attempt-heading mb-0">{data.attempt.total_score}</h2>
            </div>
            <div className="col-md-3 border-end border-secondary border-opacity-25">
              <p className="mb-0 text-white-50 small">TOTAL QUESTIONS</p>
              <h3 className="text-white mb-0">{totalQuestions}</h3>
            </div>
            <div className="col-md-2 border-end border-secondary border-opacity-25">
              <p className="mb-0 text-white-50 small">ATTEMPTED</p>
              <h3 className="text-info mb-0">{attemptedCount}</h3>
            </div>
            <div className="col-md-3 border-end border-secondary border-opacity-25">
              <p className="mb-0 text-white-50 small">CORRECT / WRONG</p>
              <h3 className="mb-0">
                <span className="text-success">{correctCount}</span>
                <span className="text-white-50 mx-2">/</span>
                <span className="text-danger">{attemptedCount - correctCount}</span>
              </h3>
            </div>
            <div className="col-md-2">
              <p className="mb-0 text-white-50 small">SKIPPED</p>
              <h3 className="text-warning mb-0">{skippedCount}</h3>
            </div>
          </div>
        </div>

        {/* --- DETAILED QUESTION REVIEW (Showing All Questions) --- */}
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <h4 className="student-heading mb-4 px-2">Detailed Question Review</h4>
            
            {data.answers.map((a, i) => {
              const isSkipped = !a.selectedAnswer;
              
              return (
                <div key={i} className={`attempt-card mb-4 border-0 shadow-sm ${isSkipped ? 'opacity-75' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                    <h5 className="mb-0">
                      <span className="text-warning me-2 fw-bold">Q{i + 1}.</span> 
                      {a.question_text}
                    </h5>
                    <div className="text-end">
                      {isSkipped ? (
                        <span className="badge bg-secondary mb-1">SKIPPED</span>
                      ) : (
                        <span className={`badge ${a.is_correct ? 'bg-success' : 'bg-danger'} mb-1`}>
                          {a.is_correct ? 'CORRECT' : 'INCORRECT'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row g-3">
                    {a.options.map((opt) => {
                      const isCorrect = opt.label === a.correctAnswer;
                      const isUserChoice = opt.label === a.selectedAnswer;
                      
                      let cardStyle = { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" };
                      let textColor = "text-white-50";

                      if (isCorrect) {
                        cardStyle = { background: "rgba(25, 135, 84, 0.2)", borderColor: "#198754" };
                        textColor = "text-success fw-bold";
                      } else if (isUserChoice && !isCorrect) {
                        cardStyle = { background: "rgba(220, 53, 69, 0.2)", borderColor: "#dc3545" };
                        textColor = "text-danger";
                      }

                      return (
                        <div key={opt.label} className="col-md-6">
                          <div className={`p-3 rounded-3 border h-100 ${textColor}`} style={cardStyle}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                <span className="me-2">
                                  {isCorrect ? "✅" : (isUserChoice ? "❌" : "○")}
                                </span>
                                <strong>{opt.label}.</strong> {opt.text}
                              </span>
                              {isUserChoice && (
                                <span className="badge bg-light text-dark" style={{fontSize: '0.6rem'}}>YOU PICKED</span>
                              )}
                              {isSkipped && isCorrect && (
                                <span className="badge bg-dark text-success border border-success" style={{fontSize: '0.6rem'}}>CORRECT ANSWER</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptResult;