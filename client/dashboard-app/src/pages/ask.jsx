import { useState } from "react";

function Chatbot({ onClose }) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setChatHistory([...chatHistory, { question, summary: data.summary }]);
      setQuestion("");
    } catch (error) {
      console.error("Chatbot API Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <h3>Chatbot</h3>
        <button onClick={onClose} style={styles.closeButton}>✖️</button>
      </div>
      <div style={styles.chatBox}>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p style={styles.userMessage}><strong>You:</strong> {chat.question}</p>
            <p style={styles.botMessage}><strong>Bot:</strong> {chat.summary}</p>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    position: "fixed",
    bottom: "60px",
    right: "20px",
    width: "300px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  chatHeader: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  chatBox: {
    padding: "10px",
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  userMessage: {
    textAlign: "right",
    color: "#007bff",
    marginBottom: "8px",
  },
  botMessage: {
    textAlign: "left",
    color: "#333",
    marginBottom: "8px",
  },
};

export default Chatbot;
