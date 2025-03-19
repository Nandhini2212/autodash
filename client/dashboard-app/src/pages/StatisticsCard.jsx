import React, { useState, useEffect } from "react";

const StatisticsCard = () => {
  const [stats, setStats] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => {
    fetch("/statistics")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
        } else {
          setStats(data);
          setSelectedColumn(data.selected_column);
        }
      })
      .catch((error) => console.error("Error fetching statistics:", error));
  }, []);

  const handleColumnChange = (event) => {
    const column = event.target.value;
    setSelectedColumn(column);

    fetch(`/statistics?column=${column}`)
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching statistics:", error));
  };

  if (!stats) {
    return <h3>Loading statistics...</h3>;
  }

  return (
    <div style={styles.card}>
      <h3>Statistics</h3>
      <label>Select Column:</label>
      <select value={selectedColumn} onChange={handleColumnChange} style={styles.select}>
        {stats.columns.map((col) => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>
      <p><strong>Mean:</strong> {stats.mean}</p>
      <p><strong>Median:</strong> {stats.median}</p>
      <p><strong>Mode:</strong> {stats.mode.join(", ")}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "2rem",
  },
  select: {
    marginLeft: "1rem",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

export default StatisticsCard;
