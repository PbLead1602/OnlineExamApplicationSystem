// frontend/src/pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      // ✅ Save token & user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Show success message
      setMessage("✅ Login successful! Redirecting...");
      setVariant("success");

      // ✅ Redirect based on role after short delay
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Invalid email or password!");
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
                <h3 className="text-center mb-3 text-white">Login</h3>

                {message && <Alert variant={variant}>{message}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 btn-glow">
                    Login
                  </Button>
                </Form>

                <br />
                <p className="mt-3 text-center">
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-decoration-none text-warning">
                    Register
                  </Link>
                </p>
                <p className="mt-2 text-center">
                  <Link to="/forgot-password" className="text-decoration-none text-info">
                    Forgot Password?
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

export default LoginPage;
