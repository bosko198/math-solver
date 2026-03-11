import React, { useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function LimitsPage() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [approach, setApproach] = useState("0"); // default limit point
  const [direction, setDirection] = useState(""); // "", "+", or "-"
  const [result, setResult] = useState(null);

  // Symbol palette (reuse from other pages)
  const symbols = [
    { latex: "\\pi", display: "π", insert: "pi", description: "Pi" },
    { latex: "e", display: "e", insert: "E", description: "Euler’s number" },
    { latex: "\\infty", display: "∞", insert: "oo", description: "Infinity" },
    { latex: "+", display: "+", insert: "+", description: "Addition" },
    { latex: "-", display: "-", insert: "-", description: "Subtraction" },
    { latex: "*", display: "×", insert: "*", description: "Multiplication" },
    { latex: "/", display: "÷", insert: "/", description: "Division" },
    { latex: "^", display: "^", insert: "^", description: "Exponentiation" },
    { latex: "\\sqrt{}", display: "√", insert: "sqrt()", description: "Square root" },
  ];

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/limit/", {
        expression,
        variable,
        approach,
        direction,
      });
      setResult(res.data.limit);
      setExpression(""); // reset after solve
    } catch (err) {
      console.error(err);
    }
  };

  // LaTeX preview
  let safeExpression = expression;
  if (safeExpression.endsWith("^")) {
    safeExpression += "{}";
  }
  const preview = `\\lim_{${variable} \\to ${approach}${direction}} ${safeExpression}`;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Limit Solver</h2>
      <p>Enter a function and specify the limit point:</p>

      <div style={{ margin: "20px", fontSize: "1.5em" }}>
        <BlockMath math={preview} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Function, e.g. sin(x)/x"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Variable: </label>
        <input
          type="text"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          style={{ width: "80px", marginRight: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Approach value: </label>
        <input
          type="text"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          style={{ width: "80px", marginRight: "10px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Direction: </label>
        <select value={direction} onChange={(e) => setDirection(e.target.value)}>
          <option value="">Two-sided</option>
          <option value="+">Right (+)</option>
          <option value="-">Left (-)</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Solve</button>

      {result && (
        <div style={{ marginTop: "30px", fontSize: "1.5em" }}>
          <BlockMath math={`${preview} = ${result}`} />
        </div>
      )}

      {/* Symbol palette */}
      <div style={{ marginTop: "30px" }}>
        <h3>Symbols</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {symbols.map((s, i) => (
            <button
              key={i}
              title={s.description}
              onClick={() => setExpression(expression + s.insert)}
              style={{ fontSize: "1.2em", padding: "5px 10px" }}
            >
              {s.display}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LimitsPage;