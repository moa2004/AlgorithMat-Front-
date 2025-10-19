import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#51cf66",
  "#ff6b6b",
  "#4dabf7",
  "#ffd43b",
  "#845ef7",
  "#ffa94d",
  "#63e6be",
  "#f783ac",
  "#141e72ff",
  "#ff9900ff",
  "#48ff00ff",
];

export default function UserStatistics({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(
          `http://localhost:5023/api/v1/Statistics/users/${userId}`
        );
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) return <div>Loading statistics...</div>;
  // If no stats yet (new user or no activity), show a friendly message
  if (!stats) {
    return (
      <div style={{ color: "#555", fontSize: 14 }}>
        No statistics yet — start solving problems to see your activity here.
      </div>
    );
  }

  // Build charts data safely even if objects are missing or empty
  const statusData = Object.entries(
    stats.numberOfSubmissionsByStatus || {}
  ).map(([status, value]) => ({ name: status, value }));

  const tagData = Object.entries(stats.solvedByTag || {}).map(
    ([tag, value]) => ({
      name: tag,
      value,
    })
  );

  // If both charts have no data, show the same explanatory message
  const isEmpty = statusData.length === 0 && tagData.length === 0;
  if (isEmpty) {
    return (
      <div style={{ color: "#555", fontSize: 14 }}>
        No statistics yet — start solving problems to see your activity here.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
      {/* دائرة الحالات */}
      <div style={{ flex: "1 1 300px", textAlign: "center" }}>
        <h3>Submission Status</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="40%"
              outerRadius={100}
              label
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* دائرة التاغات */}
      <div style={{ flex: "1 1 300px", textAlign: "center" }}>
        <h3>Tags Solved</h3>

        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={tagData}
              cx="50%"
              cy="40%" // نرفع الدائرة لفوق
              outerRadius={100}
              label
              dataKey="value"
            >
              {tagData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              align="center"
              wrapperStyle={{ marginTop: 20 }} // مسافة إضافية
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
