import { Card, CardContent, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const total = payload[0].payload.total;
    const name = payload[0].name;
    const value = payload[0].value;
    const percent = ((value / total) * 100).toFixed(1);

    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ccc",
          padding: "8px",
        }}
      >
        <p>
          <strong>{name}</strong>
        </p>
        <p>Value: ₹{value}</p>
        <p>Percentage: {percent}%</p>
      </div>
    );
  }
  return null;
};

export default function PieChartBox({ title, data, colors }) {
  // Calculate total and add it to each data point
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const dataWithTotal = data.map((item) => ({ ...item, total }));

  return (
    <Card sx={{ flex: "1 1 400px", minWidth: "300px", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
