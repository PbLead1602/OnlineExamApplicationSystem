import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clipboard } from "react-bootstrap-icons"; // Import for icon
import "./Subjects.css";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(null);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchSubjects();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editing) {
        await axios.put(`/api/subjects/${editing}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/subjects", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", description: "" });
      setEditing(null);
      fetchSubjects();
    } catch (err) {
      console.error("Error saving subject", err);
    }
  };

  // Edit subject
  const handleEdit = (subject) => {
    setForm({ name: subject.name, description: subject.description });
    setEditing(subject.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete subject
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject", err);
    }
  };

  
  return (
    <div className="subjects-page">
      <div className="overlay" />
      <div className="container subjects-container">
        <div className="text-center mb-5">
          <h1 className="subject-heading display-5 fw-bold">
            <Clipboard className="me-2 text-warning" size={32} />
            Manage Subjects
          </h1>
          <p className="text-light">Create, edit, and manage educational subjects.</p>
        </div>

        {/* Form Section */}
        <div className="glass-card mb-5">
          <h4 className="text-warning mb-4">
            {editing ? "✏️ Edit Subject" : "➕ Add New Subject"}
          </h4>
          <form className="subject-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Subject Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                name="description"
                className="form-control"
                placeholder="Description (Optional)"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className={`btn btn-warning w-100 ${editing ? "btn-outline-warning" : ""}`}
            >
              {editing ? "Update Subject" : "Add Subject"}
            </button>
          </form>
        </div>

        {/* Subject List Section */}
        <h3 className="text-light mb-4">Available Subjects</h3>
        {subjects.length === 0 ? (
          <p className="text-light text-center">No subjects available.</p>
        ) : (
          <div className="row">
            {subjects.map((sub) => (
              <div key={sub.id} className="col-md-6 col-lg-4 mb-4">
                <div className="glass-card subject-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="text-warning">{sub.name}</h5>
                    <p>{sub.description || "No description provided."}</p>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="btn btn-sm btn-outline-light"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;