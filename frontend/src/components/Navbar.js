// frontend/src/components/Navbar.js
import React from "react";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Sidebar Toggle Button (mobile only) */}
        {token && (
          <Button
            variant="outline-light"
            className="me-3 d-lg-none"
            onClick={onToggleSidebar}
          >
            ☰
          </Button>
        )}

        {/* Brand / Logo */}
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/assets/logo.jpg"
            alt="Online Exam System Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span className="fw-bold">Online Exam System</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Always visible */}
            <Nav.Link
              as={Link}
              to="/"
              className={location.pathname === "/" ? "active fw-bold text-primary" : ""}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/about"
              className={location.pathname === "/about" ? "active fw-bold text-primary" : ""}
            >
              About Us
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/contact"
              className={location.pathname === "/contact" ? "active fw-bold text-primary" : ""}
            >
              Contact Us
            </Nav.Link>

            {/* Auth buttons */}
            {!token ? (
              <>
                <Button as={Link} to="/login" variant="primary" size="sm" className="me-2">
                  Get Started
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="sm">
                  Register Now
                </Button>
              </>
            ) : (
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="ms-3"
              >
                Logout
              </Button>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
