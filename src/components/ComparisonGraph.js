import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ComparisonGraph = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "Dengue Deaths Over Time",
            data: data.map((item) => item.deaths),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { type: "category", title: { display: true, text: "Date" } },
          y: { type: "linear", title: { display: true, text: "Deaths" } },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <h3>Dengue Deaths Comparison</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ComparisonGraph;
