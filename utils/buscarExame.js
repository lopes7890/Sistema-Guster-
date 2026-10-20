import Exame from "../models/Exame.js";
import Paciente from "../models/Paciente.js";
import Processamento from "../models/Processamento.js";

import montarFiltros from "./montarFiltros.js";

const STATUS_DISPONIVEL = "Disponível";
const STATUS_ARQUIVADO  = "Arquivado";

function buscarExame(status, query, idMedico) {         
    const { where, wherePaciente } = montarFiltros(query);
    const temBusca = Reflect.ownKeys(wherePaciente).length > 0;

    return Exame.findAll({
        where: { status_visualizacao: status, id_medico: idMedico, ...where },
        include: [
            { model: Paciente, as: "Paciente", ...(temBusca ? { where: wherePaciente } : {}) },
            { model: Processamento, as: "Processamentos" },
        ],
        order: [['data_realizacao', 'DESC']],
    })
    .catch((error) => {
        console.log(`Falha ao buscar exames. Error: ${error}`);
        return [];
    });
}

export default buscarExame;