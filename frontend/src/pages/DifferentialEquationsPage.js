import React, { useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function DifferentialEquationsPage() {
  const [equations, setEquations] = useState([""]);
  const [functions, setFunctions] = useState(["y"]);
  const [variable, setVariable] = useState("x");
  const [conditions, setConditions] = useState([]);  // ✅ start as empty list
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const preprocessEquation = (eq) => {
    return eq
      .replace(/y'''\(x\)/g, "Derivative(y(x), (x,3))")
      .replace(/y''\(x\)/g, "Derivative(y(x), (x,2))")
      .replace(/y'\(x\)/g, "Derivative(y(x), x)")
      .replace(/dy\/dx/g, "Derivative(y(x), x)");
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const cleaned = equations.map(preprocessEquation).filter((eq) => eq.trim() !== "");

      if (cleaned.length === 0) {
        setError("Please enter at least one equation.");
        return;
      }

      let payload;
      if (cleaned.length === 1) {
        payload = {
          equation: cleaned[0],
          functions,
          variable,
          conditions,   // ✅ send as array of strings
        };
      } else {
        payload = {
          equations: cleaned,
          functions,
          variable,
          conditions,
        };
      }

      const res = await axios.post("http://127.0.0.1:8000/api/differential/", payload);
      setResult(res.data.solution);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to solve equation.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>Differential Equations Solver</h2>

      {/* Equations input */}
      {equations.map((eq, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <label>Equation {i + 1}: </label>
          <input
            type="text"
            value={eq}
            onChange={(e) => {
              const newEqns = [...equations];
              newEqns[i] = e.target.value;
              setEquations(newEqns);
            }}
            style={{ width: "500px" }}
          />
          <label style={{ marginLeft: "10px" }}>Function: </label>
          <input
            type="text"
            value={functions[i]}
            onChange={(e) => {
              const newFuncs = [...functions];
              newFuncs[i] = e.target.value;
              setFunctions(newFuncs);
            }}
            style={{ width: "80px" }}
          />
        </div>
      ))}
      <button onClick={() => {
        setEquations([...equations, ""]);
        setFunctions([...functions, `y${equations.length + 1}`]);
      }}>+ Add Equation</button>

      {/* Conditions input */}
      <div style={{ marginTop: "20px" }}>
        <h4>Initial Conditions</h4>
        {conditions.map((cond, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={cond}
              onChange={(e) => {
                const newConds = [...conditions];
                newConds[i] = e.target.value;
                setConditions(newConds);
              }}
              style={{ width: "500px" }}
              placeholder="e.g. y(0) = 2"
            />
          </div>
        ))}
        <button onClick={() => setConditions([...conditions, ""])}>+ Add Condition</button>
      </div>

      {/* Variable input */}
      <div style={{ marginTop: "20px" }}>
        <label>Independent variable: </label>
        <input
          type="text"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          style={{ width: "80px" }}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>Solve</button>

      {error && <div style={{ marginTop: "20px", color: "red" }}><strong>{error}</strong></div>}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Solution:</h3>
          {Array.isArray(result)
            ? result.map((sol, i) => <BlockMath key={i} math={sol} />)
            : <BlockMath math={result} />}
        </div>
      )}
    </div>
  );
}

export default DifferentialEquationsPage;