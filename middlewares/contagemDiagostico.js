import Paciente from "../models/Paciente.js";
import Exame from "../models/Exame.js";
import Processamento from "../models/Processamento.js";


function contagemDiagnostico(req, res, next) {
    const idMedico = req.medico.id;

    Promise.all([
        Paciente.count({
            where: {
                status_visualizacao: "Disponível"
            },
            include: [
                {
                    model: Exame,
                    as: "Exames",
                    attributes: [],
                    where: {
                        id_medico: idMedico
                    },
                    required: true
                }
            ],
            distinct: true,
            col: "id"
        }),

        // Total de pacientes com Hipogeusia
        Paciente.count({
            where: {
                status_visualizacao: "Disponível"
            },
            include: [
                {
                    model: Exame,
                    as: "Exames",
                    attributes: [],
                    where: {
                        id_medico: idMedico
                    },
                    required: true,
                    include: [
                        {
                            model: Processamento,
                            as: "Processamentos",
                            attributes: [],
                            where: {
                                resultado: "Hipogeusia"
                            },
                            required: true
                        }
                    ]
                }
            ],
            distinct: true,
            col: "id"
        }),

        // Total de pacientes com Ageusia
        Paciente.count({
            where: {
                status_visualizacao: "Disponível"
            },
            include: [
                {
                    model: Exame,
                    as: "Exames",
                    attributes: [],
                    where: {
                        id_medico: idMedico
                    },
                    required: true,
                    include: [
                        {
                            model: Processamento,
                            as: "Processamentos",
                            attributes: [],
                            where: {
                                resultado: "Ageusia"
                            },
                            required: true
                        }
                    ]
                }
            ],
            distinct: true,
            col: "id"
        })
    ])
        .then(([total, hipogeusia, ageusia]) => {
            res.locals.contagem = {
                total,
                hipogeusia,
                ageusia
            };

            return next();
        })
        .catch((error) => {
            console.error(
                "Erro ao contar pacientes:",
                error
            );

            return res.status(500).send(
                "Erro ao carregar as contagens dos pacientes."
            );
        });
}


export default contagemDiagnostico;