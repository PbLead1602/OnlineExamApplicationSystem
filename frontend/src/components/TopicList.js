import React from "react";
import axios from "axios";

const TopicsList = ({ topics = [], onDeleted, onUpdated }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topic?")) return;
    try {
      await axios.delete(`/api/topics/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      onDeleted?.();
    } catch (err) { console.error(err); alert("Delete failed"); }
  };

  return (
    <div>
      <h5 className="text-warning">Topics</h5>
      {topics.length === 0 ? <p className="text-light">No topics yet.</p> : (
        <div className="list-group">
          {topics.map(t => (
            <div key={t.id} className="list-group-item bg-transparent border-light d-flex justify-content-between align-items-center">
              <div>
                <strong className="text-white">{t.name}</strong>
                <div className="text-muted">{t.description}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-light me-2" onClick={() => {
                  const newName = prompt("Edit topic name", t.name);
                  if (newName !== null) {
                    axios.put(`/api/topics/${t.id}`, { name: newName, description: t.description || "" }, { headers: { Authorization: `Bearer ${token}` }})
                      .then(() => onUpdated?.()).catch(e => alert("Update failed"));
                  }
                }}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsList;
