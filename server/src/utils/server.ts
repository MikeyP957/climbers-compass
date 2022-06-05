import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import deserializeUser from "../middleware/deserializeUser";
import routes from "../routes";
import config from "../../config/default";

function createServer() {
  const app = express();

  app
    .use(
      cors({
        origin: config.origin,
        credentials: true,
      })
    )
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(deserializeUser);

  routes(app);
  return app;
}

export default createServer;
