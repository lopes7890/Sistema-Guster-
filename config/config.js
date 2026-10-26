import Sequelize from "sequelize";

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'PCan255Cxx131@',
    database: 'Guster', // Comentar na primeira execução
    timezone: '-03:00'
});

export default connection;