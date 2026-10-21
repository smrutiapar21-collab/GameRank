const { spawn } = require("child_process");
const path = require("path");
const playersRouter = require("./players");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/players", playersRouter);

app.get("/", (req, res) => {
  res.json({ message: "GameRank API is running!" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      status: "Error",
      database: "Disconnected",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.get("/api/players/heap-sort", async (req, res) => {
  try {
    // Get actual player records from PostgreSQL
    const result = await pool.query(
      "SELECT id, player_id, name, score FROM players"
    );

    if (result.rows.length === 0) {
      return res.json([]);
    }

    // Locate the compiled C++ program
    const executablePath = path.join(
      __dirname,
      "..",
      "algorithm",
      "main_api.exe"
    );

    // Start the C++ executable
    const cppProcess = spawn(executablePath, [], {
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let responded = false;

    const fail = (message) => {
      if (responded) return;
      responded = true;
      console.error("Heap Sort error:", message);
      res.status(500).json({
        error: "C++ Heap Sort execution failed",
      });
    };

    cppProcess.stdout.setEncoding("utf8");
    cppProcess.stderr.setEncoding("utf8");

    cppProcess.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    cppProcess.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    cppProcess.on("error", (error) => {
      fail(error.message);
    });

    cppProcess.on("close", (code) => {
      if (responded) return;

      if (code !== 0) {
        fail(stderr || `C++ process exited with code ${code}`);
        return;
      }

      try {
        const sortedPlayers = JSON.parse(stdout);
        responded = true;
        res.json(sortedPlayers);
      } catch (error) {
        fail("C++ program returned invalid JSON");
      }
    });

    // Send database rows to C++ through standard input
    const input = result.rows
      .map((player) =>
        [
          player.id,
          player.player_id,
          player.name.replace(/[\t\r\n]/g, " "),
          player.score,
        ].join("\t")
      )
      .join("\n");

    cppProcess.stdin.on("error", (error) => {
      if (error.code !== "EPIPE") {
        fail(error.message);
      }
    });

    cppProcess.stdin.end(input + "\n");
  } catch (error) {
    console.error("Database/Heap Sort error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Could not retrieve and sort player records",
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`GameRank API running at http://localhost:${PORT}`);
});
