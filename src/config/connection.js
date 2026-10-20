const { Sequelize } = require("sequelize");

const connection = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres"
    }
);

let connectDB = async () => {
    await connection.authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error.message);
    });
}

module.exports = { connection, connectDB };