import connection from "../config/config.js";

import Sequelize from "sequelize";

const Relatorio = connection.define('relatorios', {
    data_realizado: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    id_processamento: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Relatorio.sync({force: false});

export default Relatorio;

