import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Table, Button, Badge, InputGroup, Form, Modal } from "react-bootstrap";
import { Search, Plus, Calendar, Clock, Edit, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExam, setEditingExam] = useState({ id: "", title: "", description: "", date: "", duration: "" });

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching exams:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam? This will remove all associated questions and student attempts.")) {
      try {
        await axios.delete(`/api/exams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchExams();
      } catch (err) {
        alert("Failed to delete exam");
      }
    }
  };

  // Open Edit Modal
  const handleEditClick = (exam) => {
    setEditingExam({
      id: exam.id,
      title: exam.title,
      description: exam.description || "",
      duration: exam.duration,
      date: exam.date ? new Date(exam.date).toISOString().split('T')[0] : ""
    });
    setShowEditModal(true);
  };

  // Handle Update Submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/exams/${editingExam.id}`, editingExam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      fetchExams();
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Container className="admin-container">
        <div className="admin-glass-card mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="admin-heading mb-1">📝 Manage Exams</h2>
            <p className="text-white-50 mb-0">Total Exams Created: {exams.length}</p>
          </div>
          <Button className="admin-btn-gold" onClick={() => navigate("/admin-exam-builder")}>
            <Plus size={18} className="me-2" /> Create New Exam
          </Button>
        </div>

        <div className="admin-glass-card mb-4 p-3">
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-white-50"><Search size={18} /></InputGroup.Text>
            <Form.Control
              placeholder="Search by exam title or subject..."
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
                  <th>Exam Title</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="admin-table-row">
                      <td>
                        <div className="d-flex align-items-center">
                          <FileText size={20} className="text-warning me-3" />
                          <div>
                            <span className="fw-bold d-block">{exam.title}</span>
                            <small className="text-white-50">{exam.description?.substring(0, 30)}...</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary" className="bg-opacity-25 text-warning border border-warning border-opacity-25">
                          {exam.subject_name || "General"}
                        </Badge>
                      </td>
                      <td className="text-white-50">
                        <Calendar size={14} className="me-2 mb-1" />
                        {new Date(exam.date).toLocaleDateString()}
                      </td>
                      <td className="text-white-50">
                        <Clock size={14} className="me-2 mb-1" />
                        {exam.duration} Min
                      </td>
                      <td className="text-center">
                        <Button variant="link" className="text-info p-1 me-2 hover-scale" onClick={() => handleEditClick(exam)}>
                          <Edit size={18} />
                        </Button>
                        <Button variant="link" className="text-danger p-1 hover-scale" onClick={() => handleDelete(exam.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-white-50">
                      {loading ? "Loading data..." : "No exams found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered contentClassName="admin-glass-card border-0">
        <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
          <Modal.Title className="text-warning">✏️ Update Exam</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body className="text-white">
            <Form.Group className="mb-3">
              <Form.Label className="small text-white-50">Title</Form.Label>
              <Form.Control className="glass-input" value={editingExam.title} onChange={(e) => setEditingExam({...editingExam, title: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small text-white-50">Duration (Min)</Form.Label>
              <Form.Control type="number" className="glass-input" value={editingExam.duration} onChange={(e) => setEditingExam({...editingExam, duration: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small text-white-50">Date</Form.Label>
              <Form.Control type="date" className="glass-input" value={editingExam.date} onChange={(e) => setEditingExam({...editingExam, date: e.target.value})} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top border-secondary">
            <Button variant="outline-light" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit" className="admin-btn-gold px-4">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageExams;