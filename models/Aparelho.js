import connection from "../config/config.js";

import Sequelize from "sequelize";

const Aparelho = connection.define('aparelhos', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status_aparelho: {
        type: Sequelize.ENUM("Disponível", "Indisponível"),
        defaultValue: 'Disponível'
    }
});


export default Aparelho;