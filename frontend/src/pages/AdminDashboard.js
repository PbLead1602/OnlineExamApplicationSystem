import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { BarChart, Users, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  const username = localStorage.getItem("username");

  return (
    <Container className="mt-4">
      <h2 className="mb-1">📊 Admin Dashboard</h2>
      <p className="text-muted">Welcome, {username} 👋</p>
      <Row>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5><ClipboardList size={20} className="me-2" /> Manage Exams</h5>
            <p>Create, edit, publish exams and assign students.</p>
            <Button variant="primary">Manage</Button>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5><Users size={20} className="me-2" /> Manage Students</h5>
            <p>View / edit / import students.</p>
            <Button variant="success">Manage</Button>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5><BarChart size={20} className="me-2" /> Reports</h5>
            <p>View results and analytics.</p>
            <Button variant="warning">View</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
