
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/products", async (req, res) => {
  try {
    const { name, car, condition, stock_status, part } = req.query;
    let query = "SELECT * FROM products";
    const queryParams = [];
    const conditions = [];

    if (name) {
      queryParams.push(`%${name}%`);
      conditions.push(`name ILIKE ${queryParams.length}`);
    }
    if (car) {
      queryParams.push(`%${car}%`);
      conditions.push(`car ILIKE ${queryParams.length}`);
    }
    if (condition) {
      queryParams.push(condition);
      conditions.push(`condition = ${queryParams.length}`);
    }
    if (stock_status) {
      queryParams.push(stock_status);
      conditions.push(`stock_status = ${queryParams.length}`);
    }
    if (part) {
      queryParams.push(`%${part}%`);
      conditions.push(`part ILIKE ${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, image, car, condition, stock_status, part } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO products (name, price, image, car, condition, stock_status, part) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, price, image, car, condition, stock_status, part]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, car, condition, stock_status, part } = req.body;
    const { rows } = await pool.query(
      "UPDATE products SET name = $1, price = $2, image = $3, car = $4, condition = $5, stock_status = $6, part = $7 WHERE id = $8 RETURNING *",
      [name, price, image, car, condition, stock_status, part, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
