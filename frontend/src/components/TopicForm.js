import React, { useState } from "react";
import axios from "axios";

const TopicForm = ({ subjectId, onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId) return alert("Please select subject first");
    try {
      await axios.post(`/api/subjects/${subjectId}/topics`, { name, description }, { headers: { Authorization: `Bearer ${token}` }});
      setName(""); setDescription("");
      onSaved?.();
    } catch (err) {
      console.error("Topic create error", err);
      alert(err.response?.data?.message || "Error creating topic");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="form-label text-white">Topic name</label>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="form-label text-white">Description (optional)</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />
      </div>
      <button className="btn btn-warning">Add Topic</button>
    </form>
  );
};

export default TopicForm;
