const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: process.env.ENV_FILE || ".env" });
const uri = process.env.MONGO_URI;

const wargamesRoutes = require("./routes/wargames");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/api/wargames", wargamesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// conexión MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
