import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import supertest from "supertest";
import createServer from "../utils/server";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const userPayLoad = {
  _id: userId,
  email: "mikeyP@example.com",
  name: "Mikey P",
};
const userInput = {
  email: "mikeyP@example.com",
  name: "Mikey P",
  password: "Password!2",
  passwordConfirmation: "Password!2",
};
const sessionPayload = {
  id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2022-05-15T13:31:07.674Z"),
  updatedAt: new Date("2022-05-15T13:31:07.674Z"),
  __v: 0,
};

describe("user", () => {
  // user registration
  describe("given the username and password are valid", () => {
    it("should return the user payload", async () => {
      const createUserSerivceMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockReturnValueOnce(userPayLoad);

      const { statusCode, body } = await supertest(app)
        .post("/api/users")
        .send(userInput);

      expect(statusCode).toBe(200);
      expect(body).toEqual(userPayLoad);
      expect(createUserSerivceMock).toHaveBeenCalledWith(userInput);
    });
  });

  describe("given the passwords do not match", () => {
    it("should return a 400", async () => {
      const createUserSerivceMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockReturnValueOnce(userPayLoad);

      const { statusCode } = await supertest(app)
        .post("/api/users")
        .send({ ...userInput, passwordConfirmation: "does not match" });

      expect(statusCode).toBe(400);
      expect(createUserSerivceMock).not.toHaveBeenCalled();
    });
  });

  describe("given the user service throws", () => {
    it("should return a 409", async () => {
      const createUserSerivceMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockRejectedValue("oh no, :(");

      const { statusCode } = await supertest(app)
        .post("/api/users")
        .send(userInput);

      expect(statusCode).toBe(409);
      expect(createUserSerivceMock).toHaveBeenCalledWith(userInput);
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a singed accessToken & refreshToken", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          // @ts-ignore
          .mockReturnValue(userPayLoad);

        jest
          .spyOn(SessionService, "createSession")
          // @ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: "mikeyP@example.com",
            password: "Password!2",
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        // @ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
