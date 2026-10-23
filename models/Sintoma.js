import connection from "../config/config.js";

import Sequelize from "sequelize";

const Sintoma = connection.define('sintomas', {
    data_cov: {
        type: Sequelize.DATE,
        allowNull: true
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
        type: Sequelize.ENUM('Sim', 'Não', 'Não_sei'),
        allowNull: false
    },
    alteracao_comecou: {
        type: Sequelize.ENUM('Durante', 'Depois', 'Antes', 'Não_sei'),
        allowNull: false
    },
    situacao_alteracao_atual: {
        type: Sequelize.ENUM('Persistente', 'Melhora_parcial', 'Recuperado', 'Não_sei'),
        allowNull: false
    },
    alteracao_olfato: {
        type: Sequelize.ENUM('Sim', 'Não', 'Não_sei'),
        allowNull: false
    },
    observacao_paladar: {
        type: Sequelize.TEXT,
        allowNull: true
    }

});


export default Sintoma;