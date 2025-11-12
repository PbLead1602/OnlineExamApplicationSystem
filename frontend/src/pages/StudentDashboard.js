import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { BookOpen, Award } from "lucide-react";

const StudentDashboard = () => {
  const username = localStorage.getItem("username");

  return (
    <Container className="mt-4">
      <h2 className="mb-1">🎓 Student Dashboard</h2>
      <p className="text-muted">Welcome, {username} 👋</p>
      <Row>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5><BookOpen size={20} className="me-2" /> Available Exams</h5>
            <p>List of exams assigned or open to take.</p>
            <Button variant="primary">View Exams</Button>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5><Award size={20} className="me-2" /> Results</h5>
            <p>View your past exam results and performance.</p>
            <Button variant="success">View Results</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
