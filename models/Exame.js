import connection from "../config/config.js";

import Sequelize from "sequelize";

const Exame = connection.define('exames', {
    data_realizacao: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    status_exame: {
        type: Sequelize.ENUM('Concluído', 'Pendente', 'Cancelado'),
        defaultValue: 'Pendente'
    },
    status_visualizacao: {
        type: Sequelize.ENUM('Disponível', 'Arquivado'),
        defaultValue: 'Disponível'
    },
    id_aparelho: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_paciente: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_medico: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Exame.sync({force: false});

export default Exame;