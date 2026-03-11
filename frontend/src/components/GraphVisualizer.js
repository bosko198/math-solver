// src/components/GraphVisualizer.js
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

function GraphVisualizer({
  xFunc,
  yFunc,
  tMin,
  tMax,
  step,
  color = "blue",
  asyncMode = false,
}) {
  const [points, setPoints] = useState({ x: [], y: [] });

  useEffect(() => {
    if (!xFunc || !yFunc) return;

    // Reset points when props change
    setPoints({ x: [], y: [] });

    if (asyncMode) {
      // Batched calculation using requestAnimationFrame
      let t = tMin;
      const xVals = [];
      const yVals = [];

      function stepFrame() {
        // Process 100 points per frame
        for (let i = 0; i < 100 && t <= tMax; i++) {
          xVals.push(xFunc(t));
          yVals.push(yFunc(t));
          t += step;
        }
        setPoints({ x: [...xVals], y: [...yVals] });

        if (t <= tMax) {
          requestAnimationFrame(stepFrame);
        }
      }

      requestAnimationFrame(stepFrame);
    } else {
      // Synchronous calculation (fast for small ranges)
      const xVals = [];
      const yVals = [];
      for (let t = tMin; t <= tMax; t += step) {
        xVals.push(xFunc(t));
        yVals.push(yFunc(t));
      }
      setPoints({ x: xVals, y: yVals });
    }
  }, [xFunc, yFunc, tMin, tMax, step, asyncMode]);

  return (
    <Plot
      data={[
        {
          x: points.x,
          y: points.y,
          mode: "lines",
          line: { color },
        },
      ]}
      layout={{
        autosize: true,
        margin: { t: 20, r: 20, l: 40, b: 40 },
        xaxis: { zeroline: false },
        yaxis: { zeroline: false },
      }}
      style={{ width: "100%", height: "400px" }}
      config={{ responsive: true }}
    />
  );
}

export default GraphVisualizer;