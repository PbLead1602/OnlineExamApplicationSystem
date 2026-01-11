import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
// Added RefreshCcw for the button
import { TrendingUp, PieChart as PieIcon, RefreshCcw ,Calendar} from "lucide-react"; 
import "./admin.css";

const AdminReports = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [stats, setStats] = useState({ passed: 0, failed: 0, totalStudents: 0, totalExams: 0, totalQuestions: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for spin animation
  const token = localStorage.getItem("token");

  const fetchAnalytics = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const res = await axios.get("/api/reports/performance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPerformanceData(res.data.performance || []);
      if(res.data.summary) setStats(res.data.summary);
      
    } catch (err) {
      console.error("Error fetching real-time analytics:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const COLORS = ["#ffd700", "rgba(255, 255, 255, 0.1)"];
  const pieData = [
    { name: "Passed", value: stats.passed || 0 },
    { name: "Failed", value: stats.failed || 0 },
  ];

  const passPercentage = (stats.passed + stats.failed > 0) 
    ? Math.round((stats.passed / (stats.passed + stats.failed)) * 100) 
    : 0;

  if (loading) return (
    <div className="admin-page d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <Spinner animation="grow" variant="warning" />
    </div>
  );

  return (
    <div className="admin-page">
      <Container className="admin-container">
        {/* Header with Refresh Button */}
        <div className="admin-glass-card mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="admin-heading">📊 Analytics & Reports</h2>
            <p className="text-white-50 mb-0">Real-time performance metrics across all subjects.</p>
          </div>


          <div className="d-flex gap-2">
            <Button 
              variant="outline-light" 
              className="glass-btn d-flex align-items-center"
              onClick={() => fetchAnalytics(true)}
              disabled={isRefreshing}
            >
              <RefreshCcw size={18} className={`me-2 ${isRefreshing ? "spin-animation" : ""}`} />
              {isRefreshing ? "Updating..." : "Refresh Data"}
            </Button>
          </div>

          <div className="d-flex gap-2">
            <Button variant="outline-light" className="glass-btn d-flex align-items-center">
                <Calendar size={18} className="me-2" /> 
                Filter Dates
            </Button>
                {/* ... your Refresh button ... */}
        </div>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <div className="admin-glass-card h-100">
              <h5 className="text-warning mb-4"><TrendingUp size={18} className="me-2"/> Average Scores by Exam</h5>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "8px" }}
                      itemStyle={{ color: "#ffd700" }}
                    />
                    <Bar dataKey="avgScore" fill="#ffd700" radius={[4, 4, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="admin-glass-card h-100 text-center">
              <h5 className="text-warning mb-2"><PieIcon size={18} className="me-2"/> Pass/Fail Distribution</h5>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <h3 className="text-white mb-0">{passPercentage}%</h3>
                <p className="text-white-50 small">Global Success Rate</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Dynamic Statistics Cards */}
        <Row className="mt-4 g-4">
          {[
            { label: "Active Students", val: stats.totalStudents, color: "text-info" },
            { label: "Exams Conducted", val: stats.totalExams, color: "text-warning" },
            { label: "Questions Bank", val: stats.totalQuestions, color: "text-success" }
          ].map((stat, i) => (
            <Col md={4} key={i}>
              <div className="admin-glass-card text-center py-4 border-bottom border-warning border-0 border-3">
                <span className="text-white-50 d-block mb-1 small text-uppercase fw-bold" style={{letterSpacing: '1px'}}>{stat.label}</span>
                <h2 className={`${stat.color} mb-0 fw-bold`}>{stat.val?.toLocaleString() || 0}</h2>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminReports;