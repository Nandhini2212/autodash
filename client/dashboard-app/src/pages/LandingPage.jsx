import React from "react";
import dashboardImage from '../photo/img1.jpg';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const containerStyle = {
        fontFamily: "'Montserrat', sans-serif", // Apply Montserrat Google Font
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 2rem",
        color: "#333",
    };

    const navbarStyle = {
        backgroundColor: "#fff",
        width: "95%",
        maxWidth: "1600px",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "1rem auto 2rem auto",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.05)",
        borderRadius: "15px",
    };
    const appNameStyle = {
        fontSize: "2rem",
        fontWeight: "800",
        color: "#2c3e50",
    };

    const heroSectionStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1300px",
        width: "100%",
        marginBottom: "4rem",
    };

    const textContentStyle = {
        flex: "1",
        textAlign: "left",
        paddingRight: "2rem",
    };

    const titleStyle = {
        fontSize: "3rem",
        fontWeight: "800",
        marginBottom: "1.5rem",
        color: "#1f2937",
        lineHeight: "1.2",
    };

    const subtitleStyle = {
        fontSize: "1.2rem",
        color: "#555",
        marginBottom: "2.5rem",
        lineHeight: "1.6",
    };

    const buttonStyle = {
        backgroundColor: "#5b46f6",
        color: "white",
        fontSize: "1.1rem",
        padding: "1rem 2.5rem",
        borderRadius: "8px",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "none",
        fontWeight: "600",
    };

    const imageStyle = {
        maxWidth: '45%',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
    };

    const featureSectionStyle = {
        marginTop: "3rem",
        maxWidth: "1200px",
        width: "100%",
        textAlign: "center",
    };

    const featureListStyle = {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "2rem",
    };

    const featureItemStyle = {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)",
        textAlign: "left",
        width: "30%",
        minWidth: "300px",
    };

    const featureTitleStyle = {
        fontSize: "1.3rem",
        fontWeight: "700",
        marginBottom: "1rem",
        color: "#2c3e50",
    };

    const additionalSectionStyle = {
        marginTop: "4rem",
        padding: "2.5rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
        maxWidth: "1200px",
        textAlign: "left",
    };

      const logoStyle = {
        height: '30px',  // Adjust the height of your logo
        marginRight: '10px',
      };
      const NavigateUpload = () => {
        navigate("/upload");
      };

    return (
        <div style={containerStyle}>
            {/* Navbar */}
            <nav style={navbarStyle}>
                <div style={appNameStyle}>
                  AutoDash  
                </div>
                {/* You can add navigation links here */}
            </nav>

            {/* Hero Section */}
            <section style={heroSectionStyle}>
                <div style={textContentStyle}>
                    <h1 style={titleStyle}>
                        Unlock Powerful Insights with Dashboards
                    </h1>
                    <p style={subtitleStyle}>
                        Elevate your productivity with our customizable dashboards. Gain deep insights, manage projects efficiently, and drive data-driven decisions.
                    </p>
                    <button onClick={NavigateUpload} style={buttonStyle}>Get Started</button>
                </div>
                <img src={dashboardImage} alt="Dashboard Preview" style={imageStyle} />
            </section>

            {/* Features Section */}
            <section style={featureSectionStyle}>
                <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", color: "#2c3e50", fontWeight: "700" }}>
                    Key Features
                </h2>
                <div style={featureListStyle}>
                    <div style={featureItemStyle}>
                        <h3 style={featureTitleStyle}>Data-Driven Dashboards</h3>
                        <p>Automatically generate dashboards that adapt to your business needs with powerful visualization tools.</p>
                    </div>
                    <div style={featureItemStyle}>
                        <h3 style={featureTitleStyle}>AI-Powered Analytics</h3>
                        <p>Leverage AI to uncover hidden patterns and make smarter decisions with real-time data analysis.</p>
                    </div>
                    <div style={featureItemStyle}>
                        <h3 style={featureTitleStyle}>Customizable Reports</h3>
                        <p>Personalize your reports and dashboards to meet your unique business goals and project milestones.</p>
                    </div>
                </div>
            </section>

            {/* Additional Section */}
            <section style={additionalSectionStyle}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#2c3e50", fontWeight: "700" }}>
                    Ready to Transform Your Data?
                </h2>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                    With AutoDash, you can seamlessly track progress, analyze performance, and make data-driven decisions in one place. Unlock your business's full potential today.
                </p>
                <button style={buttonStyle}>Start Your Journey</button>
            </section>
        </div>
    );
};

export default LandingPage;