import connection from "../config/config.js";

import Sequelize from "sequelize";

const Relatorio = connection.define('relatorios', {
    data_realizado: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    pdf_url: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pdf_public_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    id_processamento: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});


export default Relatorio;

