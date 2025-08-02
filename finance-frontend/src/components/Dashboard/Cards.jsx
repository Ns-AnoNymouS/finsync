import { Box, Typography, Card } from "@mui/material";

export default function StatCard({ title, value, icon, color, darkMode }) {
  return (
    <Card
      sx={{
        flex: { xs: "100%", sm: "48%", md: "23%" },
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="subtitle2"
          color={darkMode ? "grey.400" : "grey.700"}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          color={color}
          mt={0.5}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: color,
          color: "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
