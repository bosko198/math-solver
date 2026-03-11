import React, { useState, useEffect } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function IntegralPage() {
  const [expression, setExpression] = useState("");
  const [integralType, setIntegralType] = useState("single");
  const [variables, setVariables] = useState(["x"]);
  const [bounds, setBounds] = useState([["", ""]]);
  const [result, setResult] = useState(null);

  // Symbol palette
  const symbols = [
    { latex: "\\pi", display: "π", insert: "pi", description: "Pi, ratio of circumference to diameter" },
    { latex: "e", display: "e", insert: "E", description: "Euler’s number, base of natural logarithm" },
    { latex: "\\infty", display: "∞", insert: "oo", description: "Infinity" },
    { latex: "+", display: "+", insert: "+", description: "Addition" },
    { latex: "-", display: "-", insert: "-", description: "Subtraction" },
    { latex: "*", display: "×", insert: "*", description: "Multiplication" },
    { latex: "/", display: "÷", insert: "/", description: "Division" },
    { latex: "^", display: "^", insert: "^", description: "Exponentiation, e.g. x^2" },
    { latex: "\\sqrt{}", display: "√", insert: "sqrt()", description: "Square root" },
  ];
  
  useEffect(() => {
    if (expression !== "") {
        setResult(null);
    }
  }, [expression]);

  // Update variables and bounds when type changes
  useEffect(() => {
    if (integralType === "single") {
      setVariables(["x"]);
      setBounds([["", ""]]);
    } else if (integralType === "double") {
      setVariables(["x", "y"]);
      setBounds([["", ""], ["", ""]]);
    } else if (integralType === "triple") {
      setVariables(["x", "y", "z"]);
      setBounds([["", ""], ["", ""], ["", ""]]);
    } else if (integralType === "surface") {
      setVariables(["x", "y", "z"]);
      setBounds([["", ""], ["", ""]]); // surface integrals often need region definitions
    } else if (integralType === "volume") {
      setVariables(["x", "y", "z"]);
      setBounds([["", ""], ["", ""], ["", ""]]);
    } else if (integralType === "contour") {
      setVariables(["z"]);
      setBounds([["", ""]]); // contour integrals need path definition
    }
  }, [integralType]);

  const handleSubmit = async () => {
    try {
        const res = await axios.post("http://127.0.0.1:8000/api/integrate", {
        expression,
        type: integralType,
        variables,
        bounds,
        });
        setResult(res.data.integral);

        // Reset the function input after solving
        setExpression("");
    } catch (err) {
        console.error(err);
    }
  };

    // Build LaTeX preview dynamically
  let operator = "\\int"; // default

  if (integralType === "double") operator = "\\iint";
  else if (integralType === "triple") operator = "\\iiint";
  else if (integralType === "contour") operator = "\\oint";
  else if (integralType === "surface") operator = "\\oiint";
  else if (integralType === "volume") operator = "\\oiiint";

  let integralPreview = operator;

    // Add bounds if available
  variables.forEach((v, i) => {
    if (bounds[i] && bounds[i][0] && bounds[i][1]) {
        integralPreview += `_{${bounds[i][0]}}^{${bounds[i][1]}} `;
    }
  });

    // Handle incomplete exponents safely
  let safeExpression = expression;
  if (safeExpression.endsWith("^")) {
    safeExpression += "{}";
  }

  integralPreview += ` ${safeExpression} \\, ${variables.map(v => "d" + v).join(" \\, ")}`;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Integral Solver</h2>
      <p>Select type of integral and enter function:</p>

      <div style={{ marginBottom: "20px" }}>
        <label>Integral Type: </label>
        <select
          value={integralType}
          onChange={(e) => setIntegralType(e.target.value)}
        >
          <option value="single">Single ∫</option>
          <option value="double">Double ∬</option>
          <option value="triple">Triple ∭</option>
          <option value="contour">Contour ∮</option>
          <option value="surface">Surface ∯</option>
          <option value="volume">Volume ∰</option>
        </select>
      </div>

      <div style={{ margin: "20px", fontSize: "1.5em" }}>
        <BlockMath math={integralPreview} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Function, e.g. x*y"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
      </div>

      {variables.map((v, i) => (
        bounds[i] ? (
          <div key={i} style={{ marginBottom: "10px" }}>
            <label>{v} bounds: </label>
            <input
              type="text"
              placeholder="Lower"
              value={bounds[i][0]}
              onChange={(e) => {
                const newBounds = [...bounds];
                newBounds[i][0] = e.target.value;
                setBounds(newBounds);
              }}
              style={{ width: "80px", marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="Upper"
              value={bounds[i][1]}
              onChange={(e) => {
                const newBounds = [...bounds];
                newBounds[i][1] = e.target.value;
                setBounds(newBounds);
              }}
              style={{ width: "80px" }}
            />
          </div>
        ) : null
      ))}

      <button onClick={handleSubmit}>Solve</button>

      {result && (
        <div style={{ marginTop: "30px", fontSize: "1.5em" }}>
          <BlockMath math={`${integralPreview} = ${result}`} />
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

      {/* Explanations */}
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <h4>How to type operations:</h4>
        <ul>
          <li><b>Multiplication:</b> use <code>*</code>, e.g. <code>x*y</code></li>
          <li><b>Exponentiation:</b> use <code>^</code>, e.g. <code>x^2</code></li>
          <li><b>Division:</b> use <code>/</code>, e.g. <code>x/y</code></li>
          <li><b>Square root:</b> use <code>sqrt(x)</code></li>
        </ul>
      </div>
    </div>
  );
}

export default IntegralPage;