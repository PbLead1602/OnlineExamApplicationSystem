// frontend/src/pages/ContactPage.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./Home.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);  // reset status
    try {
      const res = await axios.post("/api/contact", formData);
      console.log("✅ Response from /api/contact:", res);  // debug
      setStatus({ type: "success", msg: res.data.message });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("❌ Error in contact submit:", err.response?.data || err.message);
      setStatus({
        type: "error",
        msg: err.response?.data?.error || "Failed to send message. Try again.",
      });
    }
  };

  return (
    <div className="contact-page">
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-4 text-light">Contact Us</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="glass-card p-4">
              {status && (
                <Alert variant={status.type === "success" ? "success" : "danger"}>
                  {status.msg}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="fw-bold">Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-bold">Your Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="message">
                  <Form.Label className="fw-bold">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="glass-card p-4">
              <h5 className="fw-bold">Reach Us At</h5>
              <p>Email: support@examportal.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: Pune, Maharashtra, India</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
