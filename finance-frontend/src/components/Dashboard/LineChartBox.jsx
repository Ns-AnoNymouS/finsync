import {
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChartBox({ data, period, setPeriod }) {
  // Transform incoming data to match recharts format
  const chartData = data.map((item) => ({
    name: item.date,
    Income: item.income,
    Expenditure: item.expenditure,
  }));

  return (
    <Card sx={{ boxShadow: 3, mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Income vs Expenditure Trend</Typography>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_, v) => v && setPeriod(v)}
            size="small"
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Income"
              stroke="#2e7d32"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Expenditure"
              stroke="#c62828"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
