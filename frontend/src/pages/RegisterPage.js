// frontend/src/pages/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger"); // default error

  // Handle form submit
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setVariant("danger");
      return;
    }

    try {
      await axios.post("/api/auth/register", { name, email, password, role });

      setMessage("✅ Registration successful! Redirecting to login...");
      setVariant("success");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Registration failed!");
      setVariant("danger");
    }
  };

  return (
    <div className="auth-page d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="glass-card p-4 shadow-lg">
              <Card.Body>
                <h3 className="text-center mb-3 text-white">Register</h3>

                {message && <Alert variant={variant}>{message}</Alert>}

                <Form onSubmit={handleRegister}>
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Role Dropdown */}
                  <Form.Group className="mb-4">
                    <Form.Label className="text-white">Select Role</Form.Label>
                    <Form.Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 btn-glow">
                    Register
                  </Button>
                </Form>

                <br />
                <p className="mt-3 text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none text-warning">
                    Login
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
