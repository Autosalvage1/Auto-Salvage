require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3001;

// Allowed origins for production; include common local dev origins for testing
const allowedOrigins = [
  "https://auto-salvage.vercel.app",
  "https://autosalvage.autos",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // allow all origins if explicitly enabled via env (useful for testing)
      if (process.env.ALLOW_ALL_ORIGINS === "true") return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// handle preflight requests for all routes
app.options("*", cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Products API
app.get("/api/products", async (req, res) => {
  try {
    const { name, car, condition, stock_status, part, category } = req.query;
    let query = "SELECT * FROM products";
    const queryParams = [];
    const conditions = [];

    if (name) {
      queryParams.push(`%${name}%`);
      conditions.push(`name ILIKE $${queryParams.length}`);
    }
    if (car) {
      queryParams.push(`%${car}%`);
      conditions.push(`car ILIKE $${queryParams.length}`);
    }
    if (condition) {
      queryParams.push(condition);
      conditions.push(`condition = $${queryParams.length}`);
    }
    if (stock_status) {
      queryParams.push(stock_status);
      conditions.push(`stock_status = $${queryParams.length}`);
    }
    if (part) {
      queryParams.push(`%${part}%`);
      conditions.push(`part ILIKE $${queryParams.length}`);
    }
    if (category) {
      queryParams.push(category);
      conditions.push(`category = $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(" AND ")}`;
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
    // accept either `image` (single) or `images` (array) from client
    const { name, price, image, images, car, condition, stock_status, part, category } = req.body;
    const imageToStore = Array.isArray(images) && images.length ? images[0] : image || null;
    const { rows } = await pool.query(
      "INSERT INTO products (name, price, image, car, condition, stock_status, part, category, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'car_part') RETURNING *",
      [name, price, imageToStore, car, condition, stock_status, part, category]
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
    const { name, price, image, images, car, condition, stock_status, part, category } = req.body;
    const imageToStore = Array.isArray(images) && images.length ? images[0] : image || null;
    const { rows } = await pool.query(
      "UPDATE products SET name = $1, price = $2, image = $3, car = $4, condition = $5, stock_status = $6, part = $7, category = $8 WHERE id = $9 AND type = 'car_part' RETURNING *",
      [name, price, imageToStore, car, condition, stock_status, part, category, id]
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
    await pool.query("DELETE FROM products WHERE id = $1 AND type = 'car_part'", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Used Cars API
app.get("/api/used_cars", async (req, res) => {
  try {
    const { make, model, year_from, year_to, price_from, price_to } = req.query;
    let query = "SELECT * FROM used_cars WHERE type = 'used_car'";
    const queryParams = [];
    const conditions = [];

    if (make) {
      queryParams.push(`%${make}%`);
      conditions.push(`make ILIKE $${queryParams.length}`);
    }
    if (model) {
      queryParams.push(`%${model}%`);
      conditions.push(`model ILIKE $${queryParams.length}`);
    }
    if (year_from) {
      queryParams.push(year_from);
      conditions.push(`year >= $${queryParams.length}`);
    }
    if (year_to) {
      queryParams.push(year_to);
      conditions.push(`year <= $${queryParams.length}`);
    }
    if (price_from) {
      queryParams.push(price_from);
      conditions.push(`price >= $${queryParams.length}`);
    }
    if (price_to) {
      queryParams.push(price_to);
      conditions.push(`price <= $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` AND ${conditions.join(" AND ")}`;
    }

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/used_cars", async (req, res) => {
  try {
    const { make, model, year, price, mileage, image, images } = req.body;
    const imageToStore = Array.isArray(images) && images.length ? images[0] : image || null;
    const { rows } = await pool.query(
      "INSERT INTO used_cars (make, model, year, price, mileage, image, type) VALUES ($1, $2, $3, $4, $5, $6, 'used_car') RETURNING *",
      [make, model, year, price, mileage, imageToStore]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/used_cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, price, mileage, image, images } = req.body;
    const imageToStore = Array.isArray(images) && images.length ? images[0] : image || null;
    const { rows } = await pool.query(
      "UPDATE used_cars SET make = $1, model = $2, year = $3, price = $4, mileage = $5, image = $6 WHERE id = $7 AND type = 'used_car' RETURNING *",
      [make, model, year, price, mileage, imageToStore, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/used_cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM used_cars WHERE id = $1 AND type = 'used_car'", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Admin Login API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});