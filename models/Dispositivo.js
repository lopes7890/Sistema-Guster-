import connection from "../config/config.js";

import Sequelize from "sequelize";

const Dispositivo = connection.define('dispositivos', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status_dispositivo: {
        type: Sequelize.ENUM("Disponível", "Indisponível"),
        defaultValue: 'Disponível'
    }
});


export default Dispositivo;