import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import chalk from "chalk"; // Optional: for colored logs

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging API responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(chalk.cyan(`[LOG] ${logLine}`));
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    const port = parseInt(process.env.PORT || "5000");

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      console.log(chalk.green(`✅ Server running at http://localhost:${port}`));
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.error(chalk.red(`❌ Port ${port} is already in use.`));
        console.error(`👉 Run this to free it: ${chalk.yellow(`npx kill-port ${port}`)}`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (err) {
    console.error(chalk.red("❌ Server failed to start:"), err);
    process.exit(1);
  }
})();
