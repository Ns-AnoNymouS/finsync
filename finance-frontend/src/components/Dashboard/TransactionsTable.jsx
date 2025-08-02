import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function TransactionsTable({ transactions, darkMode }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Date", "Party", "Description", "Category", "Type", "Amount"].map((head) => (
                  <TableCell key={head}>
                    <strong>{head}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, 10).map((txn, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {" "}
                    {txn.date || txn.createdAt
                      ? format(
                          new Date(txn.date || txn.createdAt),
                          "MMM dd, yyyy, hh:mm a"
                        )
                      : "Invalid Date"}
                  </TableCell>
                  <TableCell>{txn.party}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>{txn.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={txn.type}
                      color={txn.type === "income" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₹ {txn.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/transactions")}
          >
            Show All
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
