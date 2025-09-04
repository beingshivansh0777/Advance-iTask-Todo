import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const ChartSection = ({ todos, darkMode }) => {
  // Prepare data for the chart
  const chartData = todos.map((t) => ({
    name: t.todo,
    status: t.isCompleted ? 1 : 0,
  }));

  return (
    <div className="w-full flex flex-col items-center mt-6">
      <div className="w-72 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
            <YAxis stroke={darkMode ? "#fff" : "#000"} />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="status"
              stroke={darkMode ? "#82ca9d" : "#8884d8"}
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Animated label below the chart */}
      <motion.p
        className={`mt-2 text-lg font-semibold ${
          darkMode ? "text-white" : "text-black"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Todos Chart
      </motion.p>
    </div>
  );
};

export default ChartSection;
