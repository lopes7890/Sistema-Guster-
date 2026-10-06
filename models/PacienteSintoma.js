import connection from "../config/config.js";

import Sequelize from "sequelize";

const PacienteSintoma = connection.define('pacientes_sintomas', {
    id_paciente: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_sintoma: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

PacienteSintoma.sync({force: false});

export default PacienteSintoma;

