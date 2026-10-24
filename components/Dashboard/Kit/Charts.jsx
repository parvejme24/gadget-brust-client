"use client";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatCompact, formatTaka } from "@/components/Dashboard/Kit";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SERIES = "#2d8f6a"; // single-series brand green (validated contrast on the paper surface)
const GRID = "#e9ebe5";
const TICK = "#6b7280";

const monthLabel = (key) => {
  const [y, m] = String(key).split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
};

// bars for one measure over time; points: [{ _id: "2026-05", value }] or [{ label, value }]
export function MonthlyBarChart({ points, valueLabel = "Revenue", money = true, height = 280 }) {
  const data = {
    labels: points.map((p) => p.label || monthLabel(p._id)),
    datasets: [
      {
        label: valueLabel,
        data: points.map((p) => p.value),
        backgroundColor: SERIES,
        hoverBackgroundColor: "#24775a",
        borderRadius: 4,
        borderSkipped: "bottom",
        maxBarThickness: 36,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c2024",
        padding: 10,
        cornerRadius: 10,
        displayColors: false,
        callbacks: { label: (ctx) => `${valueLabel}: ${money ? formatTaka(ctx.parsed.y) : ctx.parsed.y}` },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { color: TICK, font: { size: 11 } } },
      y: {
        beginAtZero: true,
        grid: { color: GRID },
        border: { display: false },
        ticks: { color: TICK, font: { size: 11 }, maxTicksLimit: 5, callback: (v) => (money ? formatCompact(v) : v) },
      },
    },
  };

  if (!points.length) {
    return <div className="flex items-center justify-center text-sm text-gray-500" style={{ height }}>No data for this period yet</div>;
  }

  return (
    <div style={{ height }} role="img" aria-label={`${valueLabel} by month`}>
      <Bar data={data} options={options} />
    </div>
  );
}
