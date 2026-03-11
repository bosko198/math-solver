import React, { useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

function DerivativesPage() {
  const [expression, setExpression] = useState("");
  const [variables, setVariables] = useState(["x"]);
  const [orders, setOrders] = useState([1]);
  const [mode, setMode] = useState("partial"); // "partial", "gradient", "hessian"
  const [result, setResult] = useState(null);

  const handleVariableChange = (index, value) => {
    const newVars = [...variables];
    newVars[index] = value;
    setVariables(newVars);
  };

  const handleOrderChange = (index, value) => {
    const newOrders = [...orders];
    newOrders[index] = parseInt(value);
    setOrders(newOrders);
  };

  const addVariable = () => {
    setVariables([...variables, "x"]);
    setOrders([...orders, 1]);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/derivative/", {
        expression,
        variables,
        orders,
        mode,
      });
      setResult(res.data.derivative);
      setExpression("");
    } catch (err) {
      console.error(err);
    }
  };

  // LaTeX preview
  let safeExpression = expression;
  if (safeExpression.endsWith("^")) safeExpression += "{}";

  let preview;
  if (mode === "partial") {
    preview =
      variables
        .map(
          (v, i) =>
            `\\frac{\\partial^{${orders[i]}}}{\\partial ${v}^{${orders[i]}}}`
        )
        .join(" ") + `(${safeExpression})`;
  } else if (mode === "gradient") {
    preview = `\\nabla(${safeExpression})`;
  } else {
    preview = `\\nabla^2(${safeExpression})`; // Hessian
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Derivative Solver</h2>
      <p>Enter a function and specify variables:</p>

      <div style={{ margin: "20px", fontSize: "1.5em" }}>
        <BlockMath math={preview} />
      </div>

      <input
        type="text"
        placeholder="Function, e.g. x^2*y + sin(x)"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <label>Mode: </label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="partial">Partial Derivative</option>
          <option value="gradient">Gradient (∇f)</option>
          <option value="hessian">Hessian (∇²f)</option>
        </select>
      </div>

      {mode === "partial" &&
        variables.map((v, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <label>Variable {i + 1}: </label>
            <input
              type="text"
              value={v}
              onChange={(e) => handleVariableChange(i, e.target.value)}
              style={{ width: "80px", marginRight: "10px" }}
            />
            <label>Order: </label>
            <input
              type="number"
              min="1"
              value={orders[i]}
              onChange={(e) => handleOrderChange(i, e.target.value)}
              style={{ width: "80px" }}
            />
          </div>
        ))}

      {mode === "partial" && (
        <button onClick={addVariable} style={{ marginRight: "10px" }}>
          + Add Variable
        </button>
      )}
      <button onClick={handleSubmit}>Solve</button>

      {result && (
        <div style={{ marginTop: "30px", fontSize: "1.5em" }}>
          {mode === "gradient" && Array.isArray(result) ? (
            <div>
              <h3>Gradient Components:</h3>
              {result.map((r, i) => (
                <BlockMath
                  key={i}
                  math={`\\frac{\\partial f}{\\partial ${variables[i]}} = ${r}`}
                />
              ))}
            </div>
          ) : mode === "hessian" && Array.isArray(result) ? (
            <div>
              <h3>Hessian Matrix:</h3>
              <table style={{ margin: "0 auto" }}>
                <tbody>
                  {result.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "10px" }}>
                          <BlockMath math={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <BlockMath math={`${preview} = ${result}`} />
          )}
        </div>
      )}
    </div>
  );
}

export default DerivativesPage;