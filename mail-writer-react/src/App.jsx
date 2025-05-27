import { useState, useMemo } from "react";
import "./App.css";
import {
  TextField,
  Typography,
  Container,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Select,
  Paper,
  Switch,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [receiver, setReceiver] = useState("");
  const [generateAdjustment, setGenerateAdjustment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent) {
      setError("Email content is required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
          receiver,
        }
      );
      setGenerateAdjustment(
        response.data && typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data || "No adjustment generated.")
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate email adjustment.";
      setError(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🌗 Create light and dark themes
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f5f7fa",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          {/* 🌙 Light/Dark Toggle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Email Adjustment Generator
            </Typography>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              sx={{ ml: 2 }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Receiver (Optional)"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="tone-label">Tone (Optional)</InputLabel>
              <Select
                labelId="tone-label"
                value={tone}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="sincere">Sincere</MenuItem>
                <MenuItem value="luxurious">Luxurious</MenuItem>
                <MenuItem value="funny">Funny</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} /> : "Fix My Email"}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>

          {generateAdjustment && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                🎯 Generated Adjustment
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                variant="outlined"
                value={generateAdjustment}
                inputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigator.clipboard.writeText(generateAdjustment)
                  }
                >
                  Copy to Clipboard
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setEmailContent("");
                    setGenerateAdjustment("");
                    setReceiver("");
                    setTone("");
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
