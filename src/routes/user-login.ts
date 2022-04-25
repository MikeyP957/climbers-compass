import { Express, Request, Response } from "express";

import { createUserHandler } from "../controller/user.controller";
import validateRequest from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";

// Register User

// POST /api/user
export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/users", validateRequest(createUserSchema), createUserHandler);
}

// Login
// POST /api/sessions

// get the users's sessions
// GET /api/sessions

// Logout
// DELETE /api/sessions
