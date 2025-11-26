// server/routes.ts

import type { Express } from "express";
import { createServer, type Server } from "http";

import { registerAuthRoutes } from "./auth";
import { registerTaskRoutes } from "./tasks";
import { registerWorklogRoutes } from "./worklogs";
import exportExcel from "./exportExcel";   // ⭐ Excel Export Route

export async function registerRoutes(app: Express): Promise<Server> {

  // Register all API routes
  registerAuthRoutes(app);
  registerTaskRoutes(app);
  registerWorklogRoutes(app);

  // Excel Export + Email Route
  app.use("/api", exportExcel);

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
