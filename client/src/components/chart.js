import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "../css/chart.css";

const MonthlyLineChart = ({ data }) => {
  const currentYear = new Date().getFullYear(); // Get current year
  const previousYear = currentYear - 1;
  const [selectedYears, setSelectedYears] = useState([currentYear]); // Default selected year

  const handleYearToggle = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  const years = [currentYear, previousYear];
  // Generate random colors for each year
  const generateRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  };

  // Group data by year
  const yearlyData = data.reduce((acc, curr) => {
    const year = curr.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(curr);
    return acc;
  }, {});

  // Function to convert month number to month name
  const monthToString = (month) => {
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
    return monthNames[month - 1];
  };

  // Prepare datasets for each year
  const datasets = Object.keys(yearlyData).map((year) => {
    if (!selectedYears.includes(parseInt(year))) return null;
    const yearData = yearlyData[year];
    const uniqueYears = [...new Set(data.map((item) => item.year))];
    const yearColor =
      selectedYears.length > 1 && uniqueYears.length > 1
        ? generateRandomColor()
        : "rgb(32, 177, 255)";

    return {
      label: year,
      data: yearData.map((item) => ({
        x: monthToString(item.month), // Convert month number to month name
        y: item.total_score,
        count: item.contribution_count,
      })),
      fill: false, // Don't fill area under the line
      borderColor: yearColor,
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: yearColor,
      pointBorderColor: "#fff",
      pointHoverRadius: 6,
      pointHoverBackgroundColor: yearColor,
      pointHoverBorderColor: "#fff",
    };
  });

  // Remove null values from datasets array
  const filteredDatasets = datasets.filter((dataset) => dataset !== null);

  // Chart data object
  const chartData = { datasets: filteredDatasets };

  // Chart options
  const options = {
    Responsive: true,
    maintainAspectRatio: false,
    plugins: {
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
        type: "category", // Set x-axis type to category
        position: "bottom",
        labels: [
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
        ], // Specify all months
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
      <div className="year-selector">
        {years.map((year) => (
          <label
            key={year}
            className={`year ${selectedYears.includes(year) ? "selected" : ""}`}
            onClick={() => handleYearToggle(year)}
          >
            {year}
          </label>
        ))}
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyLineChart;
