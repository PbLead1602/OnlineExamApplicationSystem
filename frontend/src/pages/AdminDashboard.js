import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BarChart, Users, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminDashboard = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <Container className="admin-container">
        {/* Header Section */}
        <div className="admin-glass-card mb-4">
          <h2 className="admin-heading mb-1">📊 Admin Dashboard</h2>
          <p className="text-white-50">Welcome, {username} 👋</p>
        </div>

        <Row>
          {/* Manage Exams Card */}
          <Col md={4}>
            <div className="admin-glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="admin-heading">
                  <ClipboardList size={22} className="me-2 mb-1" /> 
                  Manage Exams
                </h5>
                <p className="text-white-50 mt-3">
                  Create, edit, publish exams and assign students to specific tests.
                </p>
              </div>
              <Button className="admin-btn-gold mt-3 w-100">Manage</Button>
            </div>
          </Col>

          {/* Manage Students Card */}
          <Col md={4}>
            <div className="admin-glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="admin-heading">
                  <Users size={22} className="me-2 mb-1" /> 
                  Manage Students
                </h5>
                <p className="text-white-50 mt-3">
                  View, edit, or import student records and manage authentication.
                </p>
              </div>
              <Button 
                className="admin-btn-gold mt-3 w-100" 
                onClick={() => navigate("/manage-students")}
              >
                Manage Students
              </Button>
            </div>
          </Col>

          {/* Reports Card */}
          <Col md={4}>
            <div className="admin-glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="admin-heading">
                  <BarChart size={22} className="me-2 mb-1" /> 
                  Reports
                </h5>
                <p className="text-white-50 mt-3">
                  View detailed results, student performance, and overall analytics.
                </p>
              </div>
              <Button 
                className="admin-btn-gold mt-3 w-100" 
                onClick={() => navigate("/admin-reports")}
              >
                View Reports
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;