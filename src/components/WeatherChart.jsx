import { useEffect, useRef } from "react";
import {
  Chart,
  registerables
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from 'chartjs-plugin-annotation';

const magenta = "rgba(220, 33, 168, 1)";
const magenta_light = "rgba(221, 33, 168, 0.2)";
const green = "rgba(30, 184, 36, 1.0)";
const green_light = "rgba(30, 184, 36, 0.1)";
const blue = "rgba(54, 162, 235, 1)";
const blue_light = "rgba(54, 162, 235, 0.5)";

Chart.register(...registerables, ChartDataLabels, annotationPlugin);

export default function WeatherChart({ labels, temperatureData, precipitationData, airPressureData, textColor  }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    //console.log("isNight:", isNight);
    //console.log("textColor:", textColor);

    new Chart(ctx, {
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: "Temperatur (°C)",
            data: temperatureData,
            borderColor: magenta,
            backgroundColor: magenta_light,
            yAxisID: "y-temp",
            tension: 0.4,
            fill: true,
            pointRadius: 1,
          },
          {
            type: 'bar',
            label: "Niederschlag (mm)",
            data: precipitationData,
            borderColor: blue,
            backgroundColor: blue_light,
            yAxisID: "y-precip",
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          },
          {
            type: 'line',
            label: "Luftdruck (hPa)",
            data: airPressureData,
            borderColor: green,
            backgroundColor: green_light,
            yAxisID: "y-pressure",
            tension: 0.4,
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 0 } }, 
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: { labels: { color: textColor, font: { size: 16 } } },
          tooltip: {
            backgroundColor: "slategray",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#64748b",
            borderWidth: 1,
          },
          datalabels: {
            color: textColor,
            font: {
              size: 14,
            },
            align: "top",
            offset: 4,
            formatter: (value) => Math.round(value),
            display: (context) => context.datasetIndex === 0, 
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: {
                size: 16,
                weight: "bold",
              },
              callback: function (val, index) {
                // Show every second label (0-based index)
                return index % 2 === 0 ? this.getLabelForValue(val) : '';
              },
            },
            grid: {
              color: textColor,
            },
          },
          "y-temp": {
            type: "linear",
            position: "left",
            ticks: {
              color: magenta,
              font : {
                size: 16,
              },
              callback: function (value) {
                return value + "°C";
              },
            },
            grid: {
              color: textColor, //isNight ? "#ffffff" : "#1d293d",
            },
          },
          "y-pressure": { 
            type: "linear",
            position: "right",
            beginAtZero: false,

            //min: Math.min(...airPressureData)-1,
            //max: Math.max(...airPressureData)+1,
            display: true,
            grid: { drawOnChartArea: false },

            title: { 
              display: true, 
              text: 'hPa', 
              color: green, 
              font: { size: 16 } 
            },
            ticks: { 
              color: green, 
              font: { size: 16 },
              maxTicksLimit: 7   
            }, 
          }, 
          "y-precip": {
            min: 0,
            type: "linear",
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: blue,
              font: {
                size: 16,
              },
              callback: function (value) {
                return value + "mm";
              },
            },
          },
        },
      },
    });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "240px",
      }}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
