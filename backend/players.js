
const express = require("express");
const pool = require("./db");

const router = express.Router();

// GET: Retrieve all players
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, player_id, name, score FROM players ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching players:", error.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// POST: Add a new player
router.post("/", async (req, res) => {
  const { player_id, name, score } = req.body;

  if (
    player_id === undefined ||
    !String(player_id).trim() ||
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isInteger(score) ||
    score < 0
  ) {
    return res.status(400).json({
      error: "Provide a player ID, name, and non-negative integer score",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO players (player_id, name, score)
       VALUES ($1, $2, $3)
       RETURNING id, player_id, name, score`,
      [String(player_id).trim(), name.trim(), score]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "This player ID already exists",
      });
    }

    console.error("Error adding player:", error.message);
    res.status(500).json({ error: "Failed to add player" });
  }
});

module.exports = router;
