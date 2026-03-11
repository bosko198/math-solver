import React, { useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function PolynomialPage() {
  const [expression, setExpression] = useState("");
  const [operation, setOperation] = useState("factor");
  const [result, setResult] = useState(null);

  // Symbol palette (same style as IntegralPage)
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
      const res = await axios.post("http://127.0.0.1:8000/api/polynomial", {
        expression,
        operation,
      });
      setResult(res.data.result);
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
  const preview = `${safeExpression}`;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Polynomial Solver</h2>
      <p>Enter a polynomial and choose an operation:</p>

      <div style={{ marginBottom: "20px" }}>
        <label>Operation: </label>
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="factor">Factorize</option>
          <option value="expand">Expand</option>
          <option value="roots">Find Roots</option>
          <option value="differentiate">Differentiate</option>
          <option value="integrate">Integrate</option>
        </select>
      </div>

      <div style={{ margin: "20px", fontSize: "1.5em" }}>
        <BlockMath math={preview} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Polynomial, e.g. x^3 - 2x^2 + x - 2"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
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

export default PolynomialPage;