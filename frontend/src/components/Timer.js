import React, { useState, useEffect, useRef } from "react";

const Timer = ({ attemptId, durationInMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    const storageKey = `exam_end_time_${attemptId}`;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
      // Logic: Start time is NOW + Admin's duration
      endTime = Date.now() + durationInMinutes * 60 * 1000;
      localStorage.setItem(storageKey, endTime);
    } else {
      endTime = Number(endTime);
    }

    const interval = setInterval(() => {
      const diff = Math.floor((endTime - Date.now()) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        setTimeLeft(0);
        onTimeUp(); // Production-grade auto-submit
      } else {
        setTimeLeft(diff);

        // ✅ 1 Minute Warning (Visual + Alert)
        if (diff <= 60 && !warnedRef.current) {
          warnedRef.current = true;
          // Non-blocking alert or UI change
          console.warn("One minute remaining!");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptId, durationInMinutes, onTimeUp]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    const timeStr = h > 0 
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
    return timeStr;
  };

  if (timeLeft === null) return <span>Calculating time...</span>;

  // Visual warning style
  const timerStyle = timeLeft <= 60 ? { color: 'red', fontWeight: 'bold' } : {};

  return (
    <span style={timerStyle}>
      {timeLeft <= 60 ? "🚨 " : "⏱ "}
      Time Left: {formatTime(timeLeft)}
      {timeLeft <= 60 && <span className="ms-2 small">(Closing soon!)</span>}
    </span>
  );
};

export default Timer;