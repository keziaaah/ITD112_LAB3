import React from "react";
import { Bar } from "react-chartjs-2";

const DistributionGraph = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available for Dengue Cases Distribution.</p>;
  }

  // Aggregate cases by date
  const dates = [...new Set(data.map((item) => item.date))];
  const cases = dates.map(
    (date) => data
      .filter((item) => item.date === date)
      .reduce((sum, item) => sum + (item.cases || 0), 0)
  );

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Dengue Cases Over Time",
        data: cases,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Number of Cases" } },
    },
    plugins: {
      legend: { position: "top" },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default DistributionGraph;
