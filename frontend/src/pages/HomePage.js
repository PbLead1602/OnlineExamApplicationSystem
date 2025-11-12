import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { BookOpen, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

const HomePage = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero text-center">
        <Container>
          <h1 className="display-4 fw-bold">
            Welcome to <span className="brand">Online Exam System</span>
          </h1>
          <p className="lead mt-3">
            Conduct, manage, and analyze exams with ease. Built for students and admins.
          </p>
          <div className="mt-4">
            <Button
              as={Link}
              to="/login"
              variant="primary"
              size="lg"
              className="me-3 hero-btn"
            >
              Get Started
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="outline-light"
              size="lg"
              className="hero-btn"
            >
              Register Now
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <Card className="glass-card p-4">
                <BookOpen size={40} className="mb-3 text-primary" />
                <h5>Easy Exams</h5>
                <p>Create, assign, and take exams effortlessly.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="glass-card p-4">
                <Award size={40} className="mb-3 text-success" />
                <h5>Instant Results</h5>
                <p>Get results and analytics instantly.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="glass-card p-4">
                <Users size={40} className="mb-3 text-warning" />
                <h5>User Friendly</h5>
                <p>Simple interface for students and admins.</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about text-center py-5">
        <Container>
          <h2 className="fw-bold">About Us</h2>
          <p className="mt-3">
            Our Online Exam System is designed to simplify assessments for
            schools, colleges, and institutions. Secure, scalable, and
            student-friendly.
          </p>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="testimonials py-5">
        <Container>
          <h2 className="text-center fw-bold mb-4">What Users Say</h2>
          <Row>
            <Col md={4}>
              <Card className="glass-card p-3">
                <p>
                  “Very smooth and intuitive exam experience. Highly recommended
                  for institutions.”
                </p>
                <h6 className="fw-bold mt-3">– Student</h6>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="glass-card p-3">
                <p>
                  “Managing students and exams is now effortless. Great tool for
                  admins.”
                </p>
                <h6 className="fw-bold mt-3">– Admin</h6>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="glass-card p-3">
                <p>
                  “Instant results and analytics helped improve student
                  performance.”
                </p>
                <h6 className="fw-bold mt-3">– Teacher</h6>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
