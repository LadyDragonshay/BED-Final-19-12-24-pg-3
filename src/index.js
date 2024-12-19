import * as Sentry from "@sentry/node";
import { PrismaClient } from "@prisma/client";
import express from "express";
import "dotenv/config";

import usersRouter from "./routes/users.js";
import hostsRouter from "./routes/hosts.js";
import propertiesRouter from "./routes/properties.js";
import amenitiesRouter from "./routes/amenities.js";
import bookingsRouter from "./routes/bookings.js";
import reviewsRouter from "./routes/reviews.js";
import loginRouter from "./routes/login.js";
import errorHandler from "./middleware/errorHandler.js";
import log from "./middleware/logMiddleware.js";
import NotFoundError from "./errors/NotFoundError.js";

const app = express();
const prisma = new PrismaClient();

// Test database connection
prisma
  .$connect()
  .then(() => console.log("Database connection successful"))
  .catch((e) => console.error("Database connection failed", e));

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Global middleware
app.use(express.json());
app.use(log);

// Resource routes
app.use("/users", usersRouter);
app.use("/hosts", hostsRouter);
app.use("/properties", propertiesRouter);
app.use("/amenities", amenitiesRouter);
app.use("/bookings", bookingsRouter);
app.use("/reviews", reviewsRouter);

app.use("/login", loginRouter);

// Basic routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Sentry test route
//app.get("/debug-sentry", (req, res) => {
//  throw new Error("My first Sentry error!");
//});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling
app.use(errorHandler);

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      sentryId: res.sentry,
    },
  });
});

// Start server
app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});

export default app;
