import connection from "../config/config.js";

import Sequelize from "sequelize";

const Processamento = connection.define('processamentos', {
    resultado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT
    },
    id_exame: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Processamento.sync({force: false});

export default Processamento;