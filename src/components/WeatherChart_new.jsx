import { useEffect, useRef } from "react";
import {
  Chart,
  registerables
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables, ChartDataLabels, annotationPlugin);

export default function WeatherChart({ labels, temperatureData, precipitationData, airPressureData, textColor, sunrise, sunset }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    let foundFirstSBlock = false;
    let passedFirstSBlock = false;

    const transformedLabels = labels.map((label, index) => {
      if (!label || !label.startsWith("S ")) return label;

      if (!foundFirstSBlock) {
        foundFirstSBlock = true;
      }
      
      const hour = parseInt(label.split(" ")[1]);
      
      const firstSIndex = labels.findIndex(l => l.startsWith("S "));
      const lastSIndex = labels.findLastIndex(l => l.startsWith("S "));
      
      const allSIndices = labels.map((l, i) => l.startsWith("S ") ? i : -1).filter(i => i !== -1);
      const midpoint = allSIndices[Math.floor(allSIndices.length / 2)];

      if (index < midpoint) {
        return label.replace("S ", "ST ");
      } else {
        return label.replace("S ", "SN ");
      }
    });

    const hourNow = new Date().getHours();
    const isNight = hourNow >= 22 || hourNow < 6;

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 0 } }, 
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: textColor, font: { size: 16 } } },
        datalabels: {
          color: textColor,
          font: { size: 16, weight: 'bold' },
          align: "top",
          offset: 4,
          formatter: (value) => Math.round(value),
          display: (context) => context.datasetIndex === 0, 
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true, 
            maxTicksLimit: 20, 
            color: textColor, 
            font: { size: 16, weight: "bold" },
            callback: function (val, index) {
                return index % 3 === 0 ? this.getLabelForValue(val) : '';
            },
          },
          grid: { display: false },
        },
        "y-temp": {
          type: "linear",
          position: "left",
          beginAtZero: false, 
          suggestedMax: Math.max(...temperatureData) + 2, 
          ticks: {
            color: "rgba(255, 99, 132, 1)",
            callback: (value) => value + "°C",
          },
          grid: { color: "#1d293d" },
        },
        "y-pressure": { 
          type: "linear",
          position: "right",
          beginAtZero: false,

          min: Math.min(...airPressureData)-1,
          max: Math.max(...airPressureData)+1,
          display: true,
          grid: { drawOnChartArea: false },

         title: { 
            display: true, 
            text: 'hPa', 
            color: 'rgba(255, 102, 255, 1)', 
            font: { size: 16 } 
          },
          ticks: { 
            color: "rgba(255, 102, 255, 1)", 
            font: { size: 16 },
            maxTicksLimit: 7   
          }, 
        }, 

        "y-precip": {
          min: 0,
          type: "linear",
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: "rgba(54, 162, 235, 1)", font: { size: 16 } },
        },
      },
    };

    const chartInstance = new Chart(ctx, {
      data: {
        labels: transformedLabels, 
        datasets: [
          {
            type: "line",
            label: "Temperatur",
            data: temperatureData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            yAxisID: "y-temp",
            tension: 0.4,
            fill: true,
            pointRadius: 1,
          },
          {
            type: "bar", 
            label: "Niederschlag",
            data: precipitationData,
            backgroundColor: "rgba(54, 162, 235, 0.4)",
            yAxisID: "y-precip",
            barPercentage: 1.0,
            categoryPercentage: 1.0
          },
        {
            type: "line",
            label: "Luftdruck",
            data: airPressureData, 
            borderColor: "rgba(255, 153, 255, 1)", 
            backgroundColor: "rgba(255, 102, 255, 0.2)", 
            yAxisID: "y-pressure",
            tension: 0.4,
            pointRadius: 0,
            fill: true 
          },
        ]
      },
      options: chartOptions,
    });

    return () => chartInstance.destroy();
  }, [labels, temperatureData, precipitationData, airPressureData, textColor]);

  return (
    <div style={{ position: "relative", width: "100%", height: "250px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}