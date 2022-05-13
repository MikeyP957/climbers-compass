require("dotenv").config();

export default {
  port: 1337,
  host: "localhost",
  dbUri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fxjmm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  saltWorkFactor: 10,
  accessTokenPrivateKey: process.env.PRIVATE_KEY_RSA,
  accessTokenPublicKey: process.env.PUBLIC_KEY_RSA,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
};