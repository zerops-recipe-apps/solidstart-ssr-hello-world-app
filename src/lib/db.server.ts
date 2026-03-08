import pg from "pg";

const { Pool } = pg;

// Singleton pool — created once per process, shared across requests.
// SolidStart (Nitro) runs as a long-lived Node.js server.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;
