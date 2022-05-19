import { Request, Response } from "express";
import { omit } from "lodash";
import { createUser } from "../service/user.service";
import log from "../utils/logger";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);

    return res.send(user);
  } catch (error: any) {
    log.error(error);
    res.status(409).send(error.message);
  }
}
