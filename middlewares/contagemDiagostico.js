import Paciente from "../models/Paciente.js";
import Exame from "../models/Exame.js";
import Processamento from "../models/Processamento.js";

function contagemDiagnostico (req, res, next) {
    Promise.all([
        // Total de pacientes disponíveis
        Paciente.count({
            where: {
                status_visualizacao: "Disponível"
            }
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
                    required: true,
                    include: [
                        {
                            model: Processamento,
                            as: "Processamentos",
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
                    required: true,
                    include: [
                        {
                            model: Processamento,
                            as: "Processamentos",
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

            next();
        })
        .catch((error) => {
            console.error("Erro ao contar pacientes:", error);

            return res.status(500).send(
                "Erro ao carregar as contagens dos pacientes."
            );
        });
};

export default contagemDiagnostico;