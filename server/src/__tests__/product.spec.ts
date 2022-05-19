// dependencies
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import mongoose from "mongoose";

// helpers
import createServer from "../utils/server";

// services
import { createProduct } from "../service/product.service";
import { signJwt } from "../utils/jwt.utils";

// mocks
const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
export const productPayload = {
  user: userId,
  productId: "product-123",
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "This is a camera that takes fantastic pictures. You do not want to miss out on this! I am serious, you have no idea the awesomeness of this camera. It will seriously change your life!",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};

export const userPayLoad = {
  _id: userId,
  email: "MikeyP@email.com",
  name: "Mikey P",
};
const createdProduct = {
  __v: 0,
  _id: expect.any(String),
  createdAt: expect.any(String),
  image: "https://i.imgur.com/QlRphfQ.jpg",
  price: 879.99,
  productId: "product-123",
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  updatedAt: expect.any(String),
  user: expect.any(String),
};

describe("product", () => {
  beforeEach(async () => {
    const monogServer = await MongoMemoryServer.create();

    await mongoose.connect(monogServer.getUri());
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get product route", () => {
    describe("given the product does not exist", () => {
      it("should return a 404", async () => {
        const productId = "product-123";

        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    describe("given the product does exist", () => {
      it("should return a 200 status and the product", async () => {
        const product = await createProduct(productPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  describe("create product route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/products");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("return a 200 and create the product", async () => {
        const token = signJwt(userPayLoad, "accessTokenPrivateKey");

        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${token}`)
          .send(productPayload);

        expect(statusCode).toBe(200);
        expect(body).toMatchObject(createdProduct);
      });
    });
  });
});
