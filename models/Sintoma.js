import connection from "../config/config.js";

import Sequelize from "sequelize";

const Sintoma = connection.define('sintomas', {
    data_cov: {
        type: Sequelize.DATE
    },
    escala_0_10: {
        type: Sequelize.TINYINT,
        validate: {
            min: 0,
            max: 10
        }
    },
    diferenca_no_paladar: {
        type: Sequelize.ENUM('Sim', 'Não')
    },
    alteracao_primeira_vez: {
        type: Sequelize.TEXT
    },
    alteracao_durante_covid: {
        type: Sequelize.ENUM('Sim', 'Não')
    }
});


export default Sintoma;