import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// Cleaned up: Removed Row, Col, User, FileText as they were unused
import { Container, Table, Badge, InputGroup, Form, Button, Modal } from "react-bootstrap"; 
import { Search, BookOpen, Download, RefreshCcw, Eye } from "lucide-react";
import "./admin.css";

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true); // Now used below
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [attemptDetails, setAttemptDetails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const token = localStorage.getItem("token");

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/reports/all-results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setFilteredResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  useEffect(() => {
    const temp = results.filter((r) =>
      r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.exam_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(temp);
  }, [searchTerm, results]);

  const handleViewDetails = async (attemptId, studentName) => {
    try {
      const res = await axios.get(`/api/reports/attempt/${attemptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttemptDetails(res.data);
      setSelectedStudent(studentName);
      setShowDetailModal(true);
    } catch (err) {
      alert("Error loading attempt details");
    }
  };

  return (
    <div className="admin-page">
      <Container className="admin-container">
        <div className="admin-glass-card mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="admin-heading mb-1">🏆 Student Results</h2>
            <p className="text-white-50 mb-0">Review performance across all attempts.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-light" onClick={fetchResults} className="border-opacity-25">
               <RefreshCcw size={18} className={loading ? "spin" : ""} />
            </Button>
            <Button variant="outline-warning" className="d-flex align-items-center">
              <Download size={18} className="me-2" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="admin-glass-card mb-4 p-3">
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-white-50"><Search size={18} /></InputGroup.Text>
            <Form.Control
              placeholder="Search by student name or exam title..."
              className="glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="admin-glass-card p-0 overflow-hidden">
          <div className="table-responsive">
            <Table hover variant="dark" className="admin-table mb-0">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam Title</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th className="text-center">Review</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5">Loading results...</td></tr>
                ) : filteredResults.length > 0 ? (
                  filteredResults.map((res, index) => (
                    <tr key={index} className="admin-table-row">
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-3">{res.username.charAt(0)}</div>
                          <span className="fw-bold">{res.username}</span>
                        </div>
                      </td>
                      <td className="text-white-50">
                        <BookOpen size={14} className="me-2 mb-1" />
                        {res.exam_title}
                      </td>
                      <td><span className="text-warning fw-bold">{res.score}%</span></td>
                      <td>
                        <Badge bg={res.score >= 50 ? "success" : "danger"} className="bg-opacity-25 border border-opacity-25">
                          {res.score >= 50 ? "PASSED" : "FAILED"}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Button variant="link" className="text-info" onClick={() => handleViewDetails(res.attempt_id, res.username)}>
                          <Eye size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-5">No results found.</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Detail Modal code remains the same... */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered contentClassName="admin-glass-card border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
          <Modal.Title className="text-warning">Attempt Details: {selectedStudent}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white overflow-auto" style={{ maxHeight: "70vh" }}>
          {attemptDetails.length > 0 ? attemptDetails.map((q, idx) => (
            <div key={idx} className="mb-3 p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="fw-bold mb-2">Q{idx + 1}: {q.question_text}</p>
              <div className={`p-2 rounded mb-1 ${q.is_correct ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                <strong>Student Answer:</strong> {q.student_answer || "Skipped"}
              </div>
              {!q.is_correct && (
                <div className="p-2 rounded bg-info bg-opacity-10 text-info mt-1">
                  <strong>Correct Answer:</strong> {q.correct_answer}
                </div>
              )}
            </div>
          )) : <p className="text-center">No data available.</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewResults;