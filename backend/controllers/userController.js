const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 🔍 GET ALL STUDENTS
exports.getStudents = async (req, res) => {
  try {
    // FIX: Change 'username' to 'name' to match your DB
    const sql = "SELECT id, name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC";
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err); // This will show the error in your terminal
    res.status(500).json({ success: false, message: err.message });
  }
};

// ➕ ADD STUDENT
exports.addStudent = async (req, res) => {
  const { username, email, password } = req.body; // 'username' comes from frontend form
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // FIX: Use 'name' column in the INSERT statement
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')";
    await db.query(sql, [username, email, hashedPassword]);
    
    res.json({ success: true, message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ 3. UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    let sql, params;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
      params = [username, email, hashedPassword, id];
    } else {
      sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
      params = [username, email, id];
    }
    await db.query(sql, params);
    res.json({ success: true, message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ 4. DELETE USER (The missing piece for your Trash icon)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Note: If you have foreign keys, this might fail if they have exam attempts. 
    // You might want to delete student_answers and exam_attempts first.
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cannot delete student with existing exam records." });
  }
};