import connection from "../config/config.js";

import Sequelize from "sequelize";

const Sintoma = connection.define('sintomas', {
    data_cov: {
        type: Sequelize.DATE,
        allowNull: false
    },
    escala_0_10: {
        type: Sequelize.TINYINT,
        validate: {
            min: 0,
            max: 10
        },
        allowNull: false
    },
    diferenca_no_paladar: {
        type: Sequelize.ENUM('Sim', 'Não'),
        allowNull: false
    },
    alteracao_primeira_vez: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    alteracao_durante_covid: {
        type: Sequelize.ENUM('Sim', 'Não'),
        allowNull: false
    }
});


export default Sintoma;