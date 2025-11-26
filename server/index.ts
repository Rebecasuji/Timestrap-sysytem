import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import { registerAuthRoutes } from "./auth";  // <-- ADD THIS

dotenv.config();

const app = express();
const __dirname = process.cwd();

// CORS for Vercel
app.use(
  cors({
    origin: "https://timestrap-sysytem.vercel.app",
    credentials: true,
  })
);

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

// ⭐ REGISTER YOUR LOGIN API HERE ⭐
registerAuthRoutes(app);   // <--- THIS WAS MISSING

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
