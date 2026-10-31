import Sequelize from "sequelize";
import "dotenv/config";

const connection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Comentar na primeira execução
    timezone: '-03:00'
});

export default connection;