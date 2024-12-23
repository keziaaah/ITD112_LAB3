import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const CompositionGraph = ({ data = [] }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    const validData = data.filter((item) => !isNaN(item.cases) && !isNaN(item.deaths));

    const labels = validData.map((item) => item.location);
    const casesData = validData.map((item) => item.cases);
    const deathsData = validData.map((item) => item.deaths);

    setChartData({
      labels,
      datasets: [
        {
          label: "Cases",
          data: casesData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Location",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cases & Deaths",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "80%", marginTop: "1rem" }}>
      <h3>Composition Graph (Cases vs Deaths)</h3>
      {chartData ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for Composition Graph.</p>
      )}
    </div>
  );
};

export default CompositionGraph;
