import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Timer from "../components/Timer";
// Ensure your CSS file is imported
import "./studentStyle.css"; 

const StudentAttempt = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/exam-attempt/${attemptId}/questions`);
        setQuestions(res.data.questions);
        setDuration(res.data.duration);
        
        const initialAnswers = {};
        res.data.questions.forEach(q => {
          if (q.selectedAnswer) initialAnswers[q.id] = q.selectedAnswer;
        });
        setAnswers(initialAnswers);

      } catch (err) {
        alert("Failed to load exam questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [attemptId]);

  const handleAnswerChange = async (questionId, optionLabel) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
    try {
      await api.post(`/exam-attempt/${attemptId}/answer`, {
        question_id: questionId,
        selected_option: optionLabel
      });
    } catch (err) {
      console.error("Failed to auto-save", err);
    }
  };

  const handleSubmitExam = useCallback(async () => {
    if (window.confirm("Are you sure you want to submit your exam?")) {
      try {
        await api.post(`/exam-attempt/submit/${attemptId}`);
        alert("Exam submitted successfully!");
        navigate(`/attempt/${attemptId}/result`);
      } catch (err) {
        alert("Failed to submit exam");
      }
    }
  }, [attemptId, navigate]);

  if (loading) return <div className="attempt-page text-center"><h4 className="text-white">Loading Exam...</h4></div>;

  return (
    <div className="attempt-page">
      <div className="container attempt-container">
        {/* Header with Glass Effect Navigation */}
        <div className="attempt-nav-card d-flex justify-content-between align-items-center mb-4 sticky-top">
          <h2 className="attempt-heading mb-0">Exam Attempt</h2>
          
          {duration && (
            <div className="timer-wrapper">
              <Timer 
                attemptId={attemptId} 
                durationInMinutes={duration} 
                onTimeUp={handleSubmitExam} 
              />
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-12">
            {questions.map((q, index) => (
              <div key={q.id} className="attempt-card mb-4 shadow">
                <h5 className="mb-4">
                  <span className="text-warning me-2">Q{index + 1}.</span> 
                  {q.question_text}
                </h5>
                
                <div className="options-container">
                  {q.options.map((opt) => (
                    <div 
                      key={opt.label} 
                      className={`option-row p-3 mb-2 rounded-3 d-flex align-items-center ${answers[q.id] === opt.label ? 'attempt-answered' : ''}`}
                      onClick={() => handleAnswerChange(q.id, opt.label)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input custom-radio"
                          type="radio"
                          name={`question-${q.id}`}
                          checked={answers[q.id] === opt.label}
                          readOnly
                        />
                        <label className="form-check-label ms-2 fw-bold text-inherit">
                          {opt.label}. {opt.text}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Area */}
        <div className="text-center mt-4 mb-5">
          <button 
            className="btn attempt-btn btn-lg px-5 py-3 shadow" 
            onClick={handleSubmitExam}
          >
            Submit Final Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttempt;