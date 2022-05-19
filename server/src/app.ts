import config from "../config/default";
import log from "./utils/logger";
import connect from "./utils/connect";

import createServer from "./utils/server";

const port = config.port as number;
const host = config.host as string;

const app = createServer();

app.listen(port, host, () => {
  log.info(`server listening at http://${host}:${port}`);

  connect();
});
