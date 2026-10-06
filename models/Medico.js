import connection from "../config/config.js";

import Sequelize from "sequelize";

const Medico = connection.define('medicos', {
    crm: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_nasc: {
        type: Sequelize.DATE
    },
    endereco: {
        type: Sequelize.STRING,
    },
    cep: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Medico.sync({force: false});

export default Medico;