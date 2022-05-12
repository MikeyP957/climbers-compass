import express from "express";
import config from "../config/default";
import log from "./utils/logger";
import connect from "./utils/connect";
import routes from "./routes";

// middleware
import deserializeUser from "./middleware/deserializeUser";

const port = config.port as number;
const host = config.host as string;

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(deserializeUser);

app.listen(port, host, () => {
  log.info(`server listening at http://${host}:${port}`);

  connect();

  routes(app);
});
