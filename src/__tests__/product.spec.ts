import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import createServer from "../utils/server";
import mongoose from "mongoose";
import { createProduct } from "../service/product.service";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const productPayload = {
  user: userId,
  productId: "product-123",
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "This is a camera that takes fantastic pictures. You do not want to miss out on this!",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
};

describe("product", () => {
  beforeAll(async () => {
    const monogServer = await MongoMemoryServer.create();

    await mongoose.connect(monogServer.getUri());
  });

  afterAll(async () => {
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
});
