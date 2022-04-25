import { Express, Request, Response } from "express";

// controllers
import {
  createUserSessionHandler,
  getUserSessionsHandler,
} from "../controller/session.controller";
import { createUserHandler } from "../controller/user.controller";

// middleware
import validateResouce from "../middleware/validateResource";

// schemas
import { createUserSchema } from "../schema/user.schema";
import { createSessionSchema } from "../schema/session.schema";
import requireUser from "../middleware/requireUser";

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
}

export default routes;
