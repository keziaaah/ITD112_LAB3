import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";

function RelationshipGraph() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "dengueData"));
        const data = snapshot.docs.map((doc) => doc.data());

        console.log("🔥 Raw Data from Firestore:", data); // Debug Firestore data

        const points = data
          .filter(
            (item) =>
              item.cases !== undefined &&
              item.deaths !== undefined &&
              !isNaN(parseFloat(item.cases)) &&
              !isNaN(parseFloat(item.deaths))
          )
          .map((item) => ({
            x: Number(item.cases),
            y: Number(item.deaths),
          }));

        console.log("✅ Validated Points for Scatter Plot:", points); // Debug validated points

        if (points.length === 0) {
          console.warn("❌ No valid data points found for Relationship Graph.");
        }

        setChartData({
          datasets: [
            {
              label: "Cases vs Deaths",
              data: points,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderColor: "rgba(75,192,192,1)",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Cases: ${context.raw.x}, Deaths: ${context.raw.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Number of Cases",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Deaths",
        },
      },
    },
  };

  return (
    <div style={{ textAlign: "center", margin: "2rem 0" }}>
      <h3>🔗 Relationship Graph (Cases vs Deaths)</h3>
      {chartData ? (
        <Scatter data={chartData} options={options} />
      ) : (
        <p>Loading Relationship Graph...</p>
      )}
    </div>
  );
}

export default RelationshipGraph;
