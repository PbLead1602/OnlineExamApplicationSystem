// frontend/src/pages/AboutPage.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Home.css"; // reuse glassmorphism styles

const AboutPage = () => {
  return (
    <div className="about-page">
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-4 text-light">About Us</h2>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="glass-card p-4">
              <h4 className="fw-bold">Our Mission</h4>
              <p>
                The Online Exam System is designed to simplify and modernize 
                the examination process for students, teachers, and admins.
                We aim to provide a secure, transparent, and efficient 
                platform for conducting and managing online assessments.
              </p>

              <h4 className="fw-bold mt-4">Why Choose Us?</h4>
              <ul>
                <li>Seamless student registration and management</li>
                <li>Instant results and performance analytics</li>
                <li>Secure login and role-based dashboards</li>
                <li>Easy-to-use interface with responsive design</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
