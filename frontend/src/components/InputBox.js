import React, { useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import GraphVisualizer from "./GraphVisualizer";

function InputBox() {
  const [expression, setExpression] = useState("");
  const [solution, setSolution] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/step", {
        expression: expression,
      });
      setSolution(res.data.solution);
      setSteps(res.data.steps);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Math Solver</h2>
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter expression, e.g. x**2 - 4"
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSubmit}>Solve</button>

      {solution && (
        <div style={{ marginTop: "20px" }}>
          <h3>Solution:</h3>
          {solution.map((sol, i) => (
            <BlockMath key={i} math={sol} />
          ))}

          <h3>Steps:</h3>
          <ul>
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
          <GraphVisualizer expression={expression} solutions={solution} /> 
        </div>
      )}
    </div>
  );
}

export default InputBox;