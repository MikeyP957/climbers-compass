import { Request, Response } from "express";

// services
import { validatePassword } from "../service/user.service";
import { createSession } from "../service/session.service";

import config from "../../config/default";
import log from "../logger/index";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);
  console.log("session controller: user", user);
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  console.log("session controller session: ", session);

  // create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.accessTokenTtl }
  );
  console.log("session controller access token: ", accessToken);

  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: config.refreshTokenTtl }
  );

  console.log("session controller refresh token: ", refreshToken);
  // send refresh and access token
  return res.send({ accessToken, refreshToken });
}
