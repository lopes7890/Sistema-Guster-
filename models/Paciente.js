import connection from "../config/config.js";

import Sequelize from "sequelize";

const Paciente = connection.define('pacientes', {
    status_visualizacao: {
        type: Sequelize.ENUM("Disponível", "Arquivado"),
        defaultValue: "Disponível"
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_nasc: {
        type: Sequelize.DATE,
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    cep: {
        type: Sequelize.STRING
    }
});


export default Paciente;