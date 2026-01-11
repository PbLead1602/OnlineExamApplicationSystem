import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BookOpen, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./studentStyle.css";  // <--- ensure import

const StudentDashboard = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <Container className="student-container">
        <h2 className="student-heading mb-1">🎓 Student Dashboard</h2>
        <p className="student-sub">Welcome, {username} 👋</p>

        <Row className="mt-4">
          <Col md={6}>
            <Card className="student-glass p-3">
              <h5><BookOpen size={20} className="me-2" />Available Exams</h5>
              <p>Exams ready to attempt.</p>
              <Button className="student-btn" onClick={() => navigate("/exams")}>
                View Exams
              </Button>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="student-glass p-3">
              <h5><Award size={20} className="me-2" />Results</h5>
              <p>Your performance history.</p>
              <Button className="student-btn" onClick={() => navigate("/results")}>
                View Results
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;
