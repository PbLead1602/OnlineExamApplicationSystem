import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// Cleaned up: Removed Row, Col, and Calendar
import { Container, Table, Button, InputGroup, Form, Modal } from "react-bootstrap";
import { Search, UserPlus, Mail, Trash2, Edit, Lock, User } from "lucide-react";
import "./admin.css";

const ManageStudents = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, username: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setFormData({ id: user.id, username: user.username, email: user.email, password: "" });
    } else {
      setIsEditing(false);
      setFormData({ id: null, username: "", email: "", password: "" });
    }
    setShowSaveModal(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/users/${formData.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post("/api/users/add", formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowSaveModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${userToDelete.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  
    const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();
    const name = (u.name || "").toLowerCase(); // Change u.username to u.name
    const email = (u.email || "").toLowerCase();
    return name.includes(search) || email.includes(search);
    });

  return (
    <div className="admin-page">
      <Container className="admin-container">
        
        <div className="admin-glass-card mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="admin-heading mb-1">👥 Manage Students</h2>
            <p className="text-white-50 mb-0">
              {loading ? "Refreshing data..." : `Total Enrolled: ${users.length}`}
            </p>
          </div>
          <Button className="admin-btn-gold" onClick={() => handleOpenModal()}>
            <UserPlus size={18} className="me-2" /> Add Student
          </Button>
        </div>

        <div className="admin-glass-card mb-4 p-3">
          <InputGroup className="glass-input-group">
            <InputGroup.Text className="bg-transparent border-0 text-white-50"><Search size={18} /></InputGroup.Text>
            <Form.Control
              placeholder="Search students..."
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
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="3" className="text-center py-4">Loading students...</td></tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="admin-table-row">
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-circle me-3">{user.name[0].toUpperCase()}</div>
                        <span className="fw-bold">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-white-50">{user.email}</td>
                    <td className="text-center">
                      <Button variant="link" className="text-info me-2" onClick={() => handleOpenModal(user)}><Edit size={18} /></Button>
                      <Button variant="link" className="text-danger" onClick={() => handleDeleteClick(user)}><Trash2 size={18} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* SAVE MODAL */}
        <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)} centered contentClassName="admin-glass-card border-0">
          <Form onSubmit={handleSaveStudent}>
            <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
              <Modal.Title className="text-warning">{isEditing ? "Edit Student" : "Add New Student"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small">Username</Form.Label>
                <InputGroup className="glass-input-group">
                  <InputGroup.Text className="bg-transparent border-0 text-white-50"><User size={18}/></InputGroup.Text>
                  <Form.Control className="glass-input" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small">Email Address</Form.Label>
                <InputGroup className="glass-input-group">
                  <InputGroup.Text className="bg-transparent border-0 text-white-50"><Mail size={18}/></InputGroup.Text>
                  <Form.Control className="glass-input" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-white-50 small">{isEditing ? "New Password (Optional)" : "Password"}</Form.Label>
                <InputGroup className="glass-input-group">
                  <InputGroup.Text className="bg-transparent border-0 text-white-50"><Lock size={18}/></InputGroup.Text>
                  <Form.Control className="glass-input" type="password" required={!isEditing} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </InputGroup>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-top border-secondary">
              <Button variant="outline-light" onClick={() => setShowSaveModal(false)}>Cancel</Button>
              <Button type="submit" className="admin-btn-gold px-4">Save Changes</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* DELETE MODAL - Fixed: confirmDelete now attached to Button */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="admin-glass-card border-0">
          <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
            <Modal.Title className="text-danger">⚠️ Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-white p-4">
            Are you sure you want to delete <strong>{userToDelete?.username}</strong>? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer className="border-top border-secondary">
            <Button variant="outline-light" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete Permanently</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default ManageStudents;