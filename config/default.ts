require('dotenv').config()

export default {
    port: 1337,
    host:'localhost',
    dbUri:`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fxjmm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
}