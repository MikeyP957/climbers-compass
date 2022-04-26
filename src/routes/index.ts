import { Express, Request, Response } from "express";

// controllers
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controller/session.controller";
import { createUserHandler } from "../controller/user.controller";

// middleware
import validateResouce from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";

// schemas
import { createUserSchema } from "../schema/user.schema";
import { createSessionSchema } from "../schema/session.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  app.post("/api/users", validateResouce(createUserSchema), createUserHandler);

  // Login
  app.post(
    "/api/sessions",
    validateResouce(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);
}

export default routes;
