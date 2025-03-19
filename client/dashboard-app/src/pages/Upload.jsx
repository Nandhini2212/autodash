import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload_file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploading(false);

      if (response.ok) {
        alert(data.message);
        navigate("/dashboard");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert("An error occurred. Please try again.");
    }
  };

  const containerStyle = {
    fontFamily: "'Montserrat', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "2rem",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "2rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "600px",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#333",
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "2rem",
  };

  const inputStyle = {
    marginBottom: "1.5rem",
  };

  const buttonStyle = {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#7952B3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#5a3b92",
  };

  const fileNameStyle = {
    marginTop: "1rem",
    fontStyle: "italic",
    color: "#777",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Upload Your File</h2>
        <p style={subtitleStyle}>
          Upload your data file to generate powerful insights and create
          dynamic dashboards.
        </p>
        <form onSubmit={handleUpload} encType="multipart/form-data">
          <input
            type="file"
            name="file"
            className="form-control"
            style={inputStyle}
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls"
          />
          {file && <p style={fileNameStyle}>{file.name}</p>}
          <button
            type="submit"
            style={uploading ? { ...buttonStyle, backgroundColor: "#ccc" } : buttonStyle}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
