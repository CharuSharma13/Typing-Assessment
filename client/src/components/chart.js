import React from "react";
import { Line } from "react-chartjs-2";
import "../css/chart.css";
const MonthlyLineChart = ({ data }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthToString = (month) => {
    return monthNames[month - 1];
  };
  const datasets = data.map((item) => ({
    label: item.year.toString(),
    data: [
      {
        x: monthToString(item.month),
        y: item.total_score,
      },
    ],
    fill: false,
    borderColor: "rgb(32, 177, 255)",
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: "rgb(32, 177, 255)",
    pointBorderColor: "#fff",
    pointHoverRadius: 6,
    pointHoverBackgroundColor: "rgb(32, 177, 255)",
    pointHoverBorderColor: "#fff",
  }));
  const chartData = { datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Monthly Contribution Insights for this Year",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const { dataset, raw } = context;
            const { x: month, y: total_score, count } = raw;
            const year = dataset.label;
            return `Year: ${year}, Monthly Score: ${Number(total_score).toFixed(
              2
            )}% , Monthly Contribution: ${count}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        position: "bottom",
        labels: monthNames,
        offset: true, // Add padding at the beginning of the axis
        grid: {
          display: false, // Hide horizontal grid lines
        },
        scaleLabel: {
          display: true,
          labelString: "Month",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMin: 0, // Minimum value for y-axis
        suggestedMax: 100, // Maximum value for y-axis
        scaleLabel: {
          display: true,
          labelString: "Total Score (%)",
        },
      },
    },
  };
  return (
    <div className="chart-container">
      <Line data={chartData} options={options} height={200} />
    </div>
  );
};
export default MonthlyLineChart;
