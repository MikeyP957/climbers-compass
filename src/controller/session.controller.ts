import { Request, Response } from "express";

// services
import { validatePassword } from "../service/user.service";
import { createSession, findSessions } from "../service/session.service";

// helpers
import { signJwt } from "../utils/jwt.utils";

import config from "config";
import log from "../logger/index";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }
  );

  // create refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") }
  );

  // send refresh and access token
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
