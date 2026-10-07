import connection from "../config/config.js";

import Sequelize from "sequelize";

const TelefonesPaciente = connection.define('telefones_pacientes', {
    telefone: {
        type: Sequelize.STRING,
    },
    id_paciente: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


export default TelefonesPaciente;