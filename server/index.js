require("./patch-path-to-regexp.js");
require("dotenv").config();
// Monkey-patch path-to-regexp to log all parse inputs
try {
  const ptr = require("path-to-regexp");
  const origParse = ptr.parse;
  ptr.parse = function(pattern) {
    console.log("path-to-regexp.parse called with:", pattern);
    return origParse.apply(this, arguments);
  };
} catch (e) {
  console.warn("Could not patch path-to-regexp:", e);
}
// Instrument path-to-regexp to log patterns that Express parses (helps debug startup errors)
try {
  const _ptr = require('path-to-regexp');
  if (_ptr && typeof _ptr.parse === 'function') {
    const _origParse = _ptr.parse;
    _ptr.parse = function (pattern) {
      try {
        console.log('path-to-regexp.parse ->', String(pattern).slice(0, 200));
      } catch (e) {
        console.log('path-to-regexp.parse -> <unprintable pattern>');
      }
      return _origParse.apply(this, arguments);
    };
  }
} catch (err) {
  // ignore if not present yet
}

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const app = express();
const port = 3001;

// Set up uploads directory
const UPLOADS_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Allowed origins for production; include common local dev origins for testing
const allowedOrigins = [
  "https://auto-salvage.vercel.app",
  "https://autosalvage.autos",
  // Render / onrender public URL(s)
  "https://auto-salvage.onrender.com",
  "https://autosalvage.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

console.log('REGISTER: app.use(cors)');
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
console.log('REGISTER: app.options("*")');
app.options("*", cors());
console.log('REGISTER: app.use(express.json)');
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log available columns in products table at startup
pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'products'`) 
  .then(res => {
    console.log('Products table columns:', res.rows.map(r => r.column_name));
  })
  .catch(err => {
    console.error('Could not fetch products table columns:', err);
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

app.post("/api/products", upload.array("images", 10), async (req, res) => {
  try {
    console.log('POST /api/products body:', req.body);
    console.log('POST /api/products files:', req.files);
    // Accept form fields
    const { name, price, car, condition, stockStatus, part, category } = req.body;
    const stock_status_value = req.body.stock_status || stockStatus || null;
    // Insert product first
    const { rows } = await pool.query(
      "INSERT INTO products (name, price, car, condition, stock_status, part, category, type) VALUES ($1, $2, $3, $4, $5, $6, $7, 'car_part') RETURNING *",
      [name, price, car, condition, stock_status_value, part, category]
    );
    const product = rows[0];
    // Save image file paths in product_images table
    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const fileUrl = `/uploads/${file.filename}`;
        imageUrls.push(fileUrl);
        await pool.query(
          "INSERT INTO product_images (product_id, filename, mimetype, file_path) VALUES ($1, $2, $3, $4)",
          [product.id, file.originalname, file.mimetype, fileUrl]
        );
      }
    } else {
      console.warn('No files received in POST /api/products');
    }
    // Return product with image URLs
    res.json({ ...product, images: imageUrls });
  } catch (error) {
    console.error('Error in POST /api/products:', error && error.stack ? error.stack : error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log('PUT /api/products body:', req.body);
    const {
      name,
      price,
      image,
      images,
      car,
      condition,
      stock_status,
      stockStatus,
      part,
      category,
    } = req.body;
    const imageToStore = Array.isArray(images) && images.length ? images[0] : image || null;
    const stock_status_value = stock_status || stockStatus || null;

    const { rows } = await pool.query(
      "UPDATE products SET name = $1, price = $2, image = $3, car = $4, condition = $5, stock_status = $6, part = $7, category = $8 WHERE id = $9 AND type = 'car_part' RETURNING *",
      [name, price, imageToStore, car, condition, stock_status_value, part, category, id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error in PUT /api/products/:id:', error && error.stack ? error.stack : error);
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

app.post("/api/used_cars", upload.array("images", 10), async (req, res) => {
  try {
    console.log('POST /api/used_cars body:', req.body);
    console.log('POST /api/used_cars files:', req.files);
    const { make, model, year, price, mileage } = req.body;
    // Insert used car first
    const { rows } = await pool.query(
      "INSERT INTO used_cars (make, model, year, price, mileage, type) VALUES ($1, $2, $3, $4, $5, 'used_car') RETURNING *",
      [make, model, year, price, mileage]
    );
    const usedCar = rows[0];
    // Save image file paths in used_car_images table
    let imageUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const fileUrl = `/uploads/${file.filename}`;
        imageUrls.push(fileUrl);
        await pool.query(
          "INSERT INTO used_car_images (used_car_id, filename, mimetype, file_path) VALUES ($1, $2, $3, $4)",
          [usedCar.id, file.originalname, file.mimetype, fileUrl]
        );
      }
    } else {
      console.warn('No files received in POST /api/used_cars');
    }
    // Return used car with image URLs
    res.json({ ...usedCar, images: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/used_cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
  console.log('PUT /api/used_cars body:', req.body);
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