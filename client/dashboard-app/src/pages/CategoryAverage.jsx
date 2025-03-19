import React, { useEffect, useState } from "react";

const CategoryAverages = () => {
  const [columns, setColumns] = useState({ categorical: [], numerical: [] });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNumeric, setSelectedNumeric] = useState("");
  const [operation, setOperation] = useState("sum");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/get_columns")
      .then((res) => res.json())
      .then((data) => setColumns(data))
      .catch(() => setError("Error fetching columns"));
  }, []);

  const handleFetchResults = async () => {
    if (!selectedCategory || !selectedNumeric) {
      alert("Please select both categorical and numerical columns.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/aggregate?categorical_col=${selectedCategory}&numerical_col=${selectedNumeric}&operation=${operation}`
      );
      const data = await response.json();
      setResults(data);
    } catch {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Aggregation Dashboard</h2>

      {/* Dropdown for Categorical Column */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.dropdown}
      >
        <option value="">Select Categorical Column</option>
        {columns.categorical.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      {/* Dropdown for Numerical Column */}
      <select
        value={selectedNumeric}
        onChange={(e) => setSelectedNumeric(e.target.value)}
        style={styles.dropdown}
      >
        <option value="">Select Numerical Column</option>
        {columns.numerical.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      {/* Dropdown for Operation */}
      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
        style={styles.dropdown}
      >
        <option value="sum">Sum</option>
        <option value="average">Average</option>
        <option value="count">Count</option>
      </select>

      {/* Button to Fetch Results */}
      <button onClick={handleFetchResults} style={styles.button}>
        {loading ? "Fetching..." : "Get Results"}
      </button>

      {/* Error Handling */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Display Results in DataFrame Style */}
      {results && (
        <table style={styles.dataframe}>
          <thead>
            <tr>
              <th style={styles.th}>{selectedCategory}</th>
              <th style={styles.th}>
                {operation.charAt(0).toUpperCase() + operation.slice(1)} of {selectedNumeric}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results).map(([key, value]) => (
              <tr key={key}>
                <td style={styles.td}>{key}</td>
                <td style={styles.td}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "700px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  dropdown: {
    margin: "10px",
    padding: "8px",
    width: "80%",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  dataframe: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
};

export default CategoryAverages;
