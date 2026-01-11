import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TopicForm from "../components/TopicForm";
import TopicList from "../components/TopicList";
import "./Subjects.css";

const TopicsPage = ({ subjectIdFromRoute }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subjectIdFromRoute || "");
  const [topics, setTopics] = useState([]);

  const token = localStorage.getItem("token");

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await axios.get("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);

      // Auto-select first subject only when not already selected
      if (!selectedSubject && res.data.length > 0) {
        setSelectedSubject(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, selectedSubject]);

  const fetchTopics = useCallback(
    async (subjectId) => {
      if (!subjectId) {
        setTopics([]);
        return;
      }
      try {
        const res = await axios.get(`/api/subjects/${subjectId}/topics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(res.data.topics || res.data);
      } catch (err) {
        console.error(err);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchSubjects();
  }, [token, fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) fetchTopics(selectedSubject);
  }, [selectedSubject, fetchTopics]);

  return (
    <div className="subjects-page">
      <div className="overlay" />
      <div className="container subjects-container">
        <div className="text-center mb-4">
          <h1 className="subject-heading text-warning">Manage Topics</h1>
          <p className="text-light">Create & manage syllabus topics per subject</p>
        </div>

        <div className="glass-card mb-4">
          <div className="mb-3">
            <label className="form-label text-white">Select Subject</label>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- select subject --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Now these components ARE used */}
          <TopicForm
            subjectId={selectedSubject}
            onSaved={() => fetchTopics(selectedSubject)}
          />
        </div>

        <div className="glass-card mt-4">
          <TopicList
            topics={topics}
            onDeleted={() => fetchTopics(selectedSubject)}
            onUpdated={() => fetchTopics(selectedSubject)}
          />
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
