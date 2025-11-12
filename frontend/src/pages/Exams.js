// src/pages/Exams.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExamForm from "../components/ExamForm";
import { Clipboard } from "react-bootstrap-icons";
import "./Exam.css";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExam, setEditExam] = useState(null);

  const fetchExams = async () => {
    try {
      const res = await axios.get("/api/exams", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching exams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await axios.delete(`/api/exams/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchExams();
      } catch (err) {
        console.error("Error deleting exam", err);
      }
    }
  };

  const handleEdit = (exam) => {
    setEditExam(exam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = () => {
    setEditExam(null);
    fetchExams();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchExams();
  }, []);

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="exams-page">
      <div className="overlay" />
      <div className="container exams-container">
        <div className="text-center mb-5">
          <h1 className="exam-heading display-5 fw-bold">
            <Clipboard className="me-2 text-warning" size={32} />
            Manage Exams
          </h1>
          <p className="text-light">Create, edit, and manage exams efficiently.</p>
        </div>

        <div className="glass-card mb-5">
          <h4 className="text-warning mb-4">
            {editExam ? "✏️ Edit Exam" : "➕ Create New Exam"}
          </h4>
          <ExamForm exam={editExam} onSuccess={handleFormSuccess} />
        </div>

        {!loading && exams.length === 0 && (
          <p className="text-light text-center">No exams available.</p>
        )}

        {!loading && exams.length > 0 && (
          <div className="row">
            {exams.map((exam) => (
              <div key={exam.id} className="col-md-6 col-lg-4 mb-4">
                <div className="glass-card exam-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="text-warning">{exam.title}</h5>
                    <p>{exam.description || "No description provided."}</p>
                    <p className="mb-2">
                      <strong>Date:</strong> {formatDate(exam.date)}
                      <br />
                      <strong>Duration:</strong> {exam.duration} minutes
                    </p>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      onClick={() => handleEdit(exam)}
                      className="btn btn-sm btn-outline-light"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="btn btn-sm btn-danger"
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
  );
};

export default Exams;
