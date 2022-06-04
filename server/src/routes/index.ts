import { Express, Request, Response } from "express";

// controllers
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controller/session.controller";
import { createUserHandler, getCurrentUser } from "../controller/user.controller";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "../controller/product.controller";

// middleware
import validateResouce from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";

// schemas
import { createUserSchema } from "../schema/user.schema";
import { createSessionSchema } from "../schema/session.schema";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "../schema/product.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  app.post("/api/users", validateResouce(createUserSchema), createUserHandler);

  app.get('/api/me', requireUser, getCurrentUser)

  // Login
  app.post(
    "/api/sessions",
    validateResouce(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  // Product Routes
  app.post(
    "/api/products",
    [requireUser, validateResouce(createProductSchema)],
    createProductHandler
  );

  app.put(
    "/api/products/:productId",
    [requireUser, validateResouce(updateProductSchema)],
    updateProductHandler
  );

  app.get(
    "/api/products/:productId",
    validateResouce(getProductSchema),
    getProductHandler
  );

  app.delete(
    "/api/products/:productId",
    [requireUser, validateResouce(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
