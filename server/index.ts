
import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS (Allow your Vercel frontend)
app.use(
  cors({
    origin: "https://timestrap-sysytem.vercel.app",
    credentials: true,
  })
);

// JSON, Sessions, Passport
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---- API ROUTES HERE ----
// Example:
// app.use("/api/users", userRoutes);

// SERVE FRONTEND (client/dist)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ---- PORT (IMPORTANT FOR RENDER) ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
