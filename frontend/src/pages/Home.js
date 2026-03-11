// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6ebf5, #fdfdfd)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Artistic blurred background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(0,0,255,0.15), transparent 60%)," +
            "radial-gradient(circle at 80% 70%, rgba(255,0,0,0.15), transparent 60%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      {/* Overlay formulas */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          fontSize: "28px",
          fontFamily: "serif",
          color: "rgba(0,0,0,0.15)",
        }}
      >
        e<sup>iπ</sup> + 1 = 0
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          fontSize: "26px",
          fontFamily: "serif",
          color: "rgba(0,0,0,0.15)",
        }}
      >
        ∫ x² dx = (x³ / 3) + C
      </div>

      {/* Foreground content */}
      <div style={{ zIndex: 1, textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "52px", marginBottom: "20px" }}>
          Math Solver
        </h1>
        <p style={{ fontStyle: "italic", fontSize: "22px", marginBottom: "40px" }}>
          Choose what you want to explore
        </p>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          <button onClick={() => navigate("/polynomial")}>Polynomial</button>
          <button onClick={() => navigate("/limits")}>Limits</button>
          <button onClick={() => navigate("/derivatives")}>Derivatives</button>
          <button onClick={() => navigate("/integrals")}>Integrals</button>
          <button onClick={() => navigate("/differential")}>Differential Equations</button>
        </div>
      </div>
    </div>
  );
}

export default Home;