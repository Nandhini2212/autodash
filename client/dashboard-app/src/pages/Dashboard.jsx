import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Chatbot from "./ask";
import StatisticsCard from "./StatisticsCard";
import CategoryAverages from "./CategoryAverage";


function Dashboard() {
  const [charts, setCharts] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [insights, setInsights] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    fetch("/get_charts")
      .then((response) => response.json())
      .then((data) => setCharts(data))
      .catch((error) => console.error("Error fetching charts:", error));
  }, []);

  const fetchInsights = async (title, chartData) => {
    setSelectedChart({ title, chartData });
    setInsights("Loading AI Insights...");

    try {
      const response = await fetch("/get_insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartData }),
      });

      const data = await response.json();
      setInsights(data.insights);
    } catch {
      setInsights("Failed to load AI insights");
    }
  };

  const toggleChatbot = () => setShowChatbot(!showChatbot);

  if (!charts) {
    return <h3 style={{ textAlign: "center", marginTop: "1rem" }}>Loading charts...</h3>;
  }

  const styles = {
    sidebar: {
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      width: "250px",
      backgroundColor: "#f8f9fa",
      padding: "2rem",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    },
    sidebarItem: {
      marginBottom: "1.5rem",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
      color: "#333",
      textDecoration: "none",
      transition: "color 0.2s ease-in-out",
    },
    container: {
      marginLeft: "260px",
      padding: "2rem",
    },
    chartContainer: {
      width: "45%",
      backgroundColor: "white",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "0.5rem",
      padding: "1rem",
      marginBottom: "1rem",
      transition: "transform 0.3s ease",
    },
    plot: {
      width: "100%",
    },
    button: {
      marginTop: "1rem",
      padding: "0.75rem 1.5rem",
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "0.375rem",
      cursor: "pointer",
      border: "none",
      transition: "background-color 0.3s ease",
    },
    insightsContainer: {
      marginTop: "2rem",
      padding: "1.5rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    fontFamily: {
      fontFamily: "'Montserrat', sans-serif",
    },
    floatingIcon: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#007bff",
      color: "white",
      padding: "15px",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
    },
  };

  const isChartDataValid = (chartData) => {
    try {
      const parsedChart = JSON.parse(chartData);
      return parsedChart && parsedChart.data && parsedChart.data.length > 0;
    } catch {
      return false;
    }
  };

  return (
    <div style={styles.fontFamily}>
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: "2rem", fontSize: "1.5rem" }}>Features 🛠️</h2>
        <div style={styles.sidebarItem}>📊 Show DataFrame</div>
        <div style={styles.sidebarItem}>🔍 Filter Data</div>
        <div style={styles.sidebarItem}>📈 Generate Report</div>
      </div>

      <div style={styles.container}>
        <h2>Data Insights Visualized</h2>
        <p>Here are the insights and charts generated from your data.</p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
          {Object.entries(charts).map(([title, chartData], index) => (
            isChartDataValid(chartData) && (
              <div key={index} style={styles.chartContainer}>
                <Plot data={JSON.parse(chartData).data} layout={JSON.parse(chartData).layout} style={styles.plot} />
              </div>
            )
          ))}
        </div>

        <StatisticsCard/>
        <CategoryAverages/>

        {selectedChart && (
          <div style={styles.insightsContainer}>
            <h4>AI Insights for: {selectedChart.title}</h4>
            <p>{insights}</p>
          </div>
        )}

        {showChatbot && <Chatbot onClose={toggleChatbot} />}

        <div style={styles.floatingIcon} onClick={toggleChatbot}>💬</div>
      </div>
    </div>
  );
}

export default Dashboard;
