require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════╗
  ║  🚀  Server running on http://localhost:${PORT}  ║
  ║  📦  Environment: ${(process.env.NODE_ENV || "development").padEnd(24)}║
  ╚═══════════════════════════════════════════════╝
    `);
  });
});
