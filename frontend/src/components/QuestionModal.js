// frontend/src/components/QuestionModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const LABELS = {
  mcq: ["A","B","C","D","E","F","G"],
  numeric: ["1","2","3","4","5","6","7"],
  roman: ["i","ii","iii","iv","v","vi","vii"],
  tf: ["True","False"]
};

const QuestionModal = ({ mode, question, subjects, token, onClose }) => {
  const isView = mode === "view";
  const isDelete = mode === "delete";

  const [form, setForm] = useState({
    subject_id: "",
    question_text: "",
    question_type: "mcq", // mcq, numeric, roman, tf, custom
    options: [],
    correct_options: [],
    marks: 1
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (question && (mode === "edit" || mode === "view")) {
      // populate from question
      setForm({
        subject_id: question.subject_id,
        question_text: question.question_text || "",
        question_type: detectType(question.options || []),
        options: question.options || [],
        correct_options: question.correct_options || [],
        marks: question.marks || 1
      });
    } else {
      // default new
      setForm({
        subject_id: subjects?.[0]?.id || "",
        question_text: "",
        question_type: "mcq",
        options: getDefaultOptions("mcq"),
        correct_options: [],
        marks: 1
      });
    }
    // eslint-disable-next-line
  }, [question, mode, subjects]);

  function detectType(options) {
    // try to detect type based on labels
    if (!Array.isArray(options) || options.length === 0) return "mcq";
    const labels = options.map(o => o.label);
    if (labels.every(l => ["True","False"].includes(l)) && labels.length === 2) return "tf";
    if (labels.every(l => /^[0-9]+$/.test(l))) return "numeric";
    if (labels.every(l => /^[ivx]+$/.test(l))) return "roman";
    return "mcq";
  }

  function getDefaultOptions(type) {
    if (type === "tf") return LABELS.tf.map(l => ({ label: l, text: l }));
    const labels = LABELS[type] || LABELS.mcq;
    // default 4 options for mcq-like types (min 2)
    const count = type === "mcq" ? 4 : 4;
    return labels.slice(0, count).map(l => ({ label: l, text: "" }));
  }

  // on type change -> regenerate labels but preserve text if possible
  function handleTypeChange(e) {
    const type = e.target.value;
    const oldOptions = form.options || [];
    const maxKeep = Math.min(oldOptions.length, (type === "tf" ? 2 : Math.max(2, oldOptions.length)));
    const newLabels = type === "tf" ? LABELS.tf : LABELS[type] || LABELS.mcq;
    const newOptions = newLabels.slice(0, Math.max(2, maxKeep)).map((lab, idx) => {
      const existing = oldOptions[idx];
      return { label: lab, text: existing ? existing.text : "" };
    });
    setForm((f) => ({ ...f, question_type: type, options: newOptions, correct_options: [] }));
  }

  const handleOptionChange = (idx, value) => {
    const copy = [...form.options];
    copy[idx] = { ...copy[idx], text: value };
    setForm((f) => ({ ...f, options: copy }));
  };

  const addOption = () => {
    if (form.options.length >= 7) return;
    const labels = LABELS[form.question_type] || LABELS.mcq;
    const nextLabel = labels[form.options.length] || `Opt${form.options.length + 1}`;
    setForm((f) => ({ ...f, options: [...f.options, { label: nextLabel, text: "" }] }));
  };
  const removeOption = (idx) => {
    if (form.options.length <= 2) return;
    const copy = [...form.options];
    const removed = copy.splice(idx, 1);
    const newCorrect = form.correct_options.filter(c => !removed.some(r => r.label === c));
    setForm((f) => ({ ...f, options: copy, correct_options: newCorrect }));
  };

  const toggleCorrect = (label) => {
    const current = new Set(form.correct_options || []);
    if (current.has(label)) current.delete(label);
    else current.add(label);
    setForm((f) => ({ ...f, correct_options: Array.from(current) }));
  };

  const submitCreate = async () => {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        subject_id: form.subject_id,
        question_text: form.question_text,
        options: form.options,
        correct_options: form.correct_options,
        marks: parseInt(form.marks, 10)
      };
      await axios.post("/api/questions", payload, { headers: { Authorization: `Bearer ${token}` } });
      onClose(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creating question");
    } finally {
      
      setSubmitting(false);
    }
  };

  const submitUpdate = async () => {
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        subject_id: form.subject_id,
        question_text: form.question_text,
        options: form.options,
        correct_options: form.correct_options,
        marks: parseInt(form.marks, 10)
      };
      await axios.put(`/api/questions/${question.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      onClose(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating question");
    } finally {
      setSubmitting(false);
    }
  };

  const submitDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`/api/questions/${question.id}`, { headers: { Authorization: `Bearer ${token}` } });
      onClose(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error deleting");
    } finally {
      setSubmitting(false);
    }
  };

  

  // We cannot call parent's direct because we used 'onClose' prop name earlier.
  // To keep it simple — we'll call the passed onClose via window.postMessage-like trick:
  // Actually simpler: parent passed onClose as function 'onClose' via prop.
  // We'll call that now:
  function finishAndClose(didChange = false) {
    if (typeof onClose === "function") {
      onClose(didChange);
    }
  }

  return (
    <Modal show onHide={() => finishAndClose(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "add" && "Add Question"}
          {mode === "edit" && "Edit Question"}
          {mode === "view" && "Question Details"}
          {mode === "delete" && "Confirm Delete"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isDelete ? (
          <div>
            <p>Are you sure you want to delete this question?</p>
            <p><strong>{question?.question_text}</strong></p>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        ) : isView ? (
          <div>
            <h5>{form.question_text}</h5>
            <p className="text-muted">Subject: {question?.subject_name}</p>
            <div>
              {form.options.map((o, idx) => (
                <div key={idx} className="mb-2">
                  <strong>{o.label}.</strong> {o.text}
                  {form.correct_options.includes(o.label) && <span className="badge bg-success ms-2">Correct</span>}
                </div>
              ))}
            </div>
            <p className="mt-2"><small>Marks: {form.marks}</small></p>
          </div>
        ) : (
          <Form>
            {error && <div className="alert alert-danger">{error}</div>}

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Select value={form.subject_id} onChange={(e) => setForm(f => ({ ...f, subject_id: e.target.value }))}>
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marks</Form.Label>
                  <Form.Control type="number" min="1" value={form.marks} onChange={(e) => setForm(f => ({ ...f, marks: e.target.value }))} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select value={form.question_type} onChange={handleTypeChange}>
                    <option value="mcq">MCQ (A,B,C...)</option>
                    <option value="numeric">Numeric (1,2,3...)</option>
                    <option value="roman">Roman (i, ii...)</option>
                    <option value="tf">True / False</option>
                    <option value="custom">Custom (manual labels)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.question_text} onChange={(e) => setForm(f => ({ ...f, question_text: e.target.value }))} />
            </Form.Group>

            <div>
              <label className="form-label">Options</label>
              {form.options.map((opt, idx) => (
                <Row key={idx} className="align-items-center mb-2">
                  <Col md={1}><strong>{opt.label}</strong></Col>
                  <Col md={8}>
                    <Form.Control placeholder={`Option ${opt.label}`} value={opt.text} onChange={(e) => handleOptionChange(idx, e.target.value)} />
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Form.Check type="checkbox" label="Correct" checked={form.correct_options.includes(opt.label)} onChange={() => toggleCorrect(opt.label)} />
                  </Col>
                  <Col md={1}>
                    <Button variant="danger" size="sm" onClick={() => removeOption(idx)} disabled={form.options.length <= 2}>✖</Button>
                  </Col>
                </Row>
              ))}
              <div className="mt-2">
                <Button variant="outline-light" size="sm" onClick={addOption} disabled={form.options.length >= 7}>+ Add Option</Button>
              </div>
            </div>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => finishAndClose(false)}>Close</Button>

        {!isView && !isDelete && (
          <>
            {mode === "add" && <Button variant="primary" onClick={submitCreate} disabled={submitting}>Create</Button>}
            {mode === "edit" && <Button variant="primary" onClick={submitUpdate} disabled={submitting}>Update</Button>}
          </>
        )}

        {isDelete && <Button variant="danger" onClick={submitDelete} disabled={submitting}>Delete</Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionModal;
