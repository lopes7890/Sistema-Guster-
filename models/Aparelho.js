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

Aparelho.sync({force: false});

export default Aparelho;