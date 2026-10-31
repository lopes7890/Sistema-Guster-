import Sequelize from "sequelize";
import "dotenv/config";
import fs from "fs";

const caminhoCertificado = process.env.DB_SSL_CA_PATH;

const connection = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    timezone: "-03:00",

    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(caminhoCertificado),
            rejectUnauthorized: true
        }
    }
});

export default connection;