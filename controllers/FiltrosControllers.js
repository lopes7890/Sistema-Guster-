import express from "express";
import { Op } from "sequelize";

import buscarExame from "../utils/buscarExame.js";
import prepararExames from "../utils/prepararExames.js";
import formatarData from "../utils/formatarData.js";

import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import Paciente from "../models/Paciente.js";
import Exame from "../models/Exame.js";
import Processamento from "../models/Processamento.js";

const router = express.Router();

router.get("/pacientes/filtrar", autenticado, carregarMedico, async (req, res) => {
        try {
            const { busca = "", periodo = "todos" } = req.query;

            const where = {};

            // Busca por nome ou CPF
            if (busca.trim()) {
                where[Op.or] = [
                    {
                        nome: {
                            [Op.like]: `%${busca.trim()}%`
                        }
                    },
                    {
                        cpf: {
                            [Op.like]: `%${busca.trim()}%`
                        }
                    }
                ];
            }

            // Filtro pela data de cadastro
            const agora = new Date();
            const inicio = new Date(agora);
            const fim = new Date(agora);

            inicio.setHours(0, 0, 0, 0);
            fim.setHours(23, 59, 59, 999);

            if (periodo === "hoje") {
                where.createdAt = {
                    [Op.between]: [inicio, fim]
                };
            } else if (periodo === "ontem") {
                inicio.setDate(inicio.getDate() - 1);
                fim.setDate(fim.getDate() - 1);

                where.createdAt = {
                    [Op.between]: [inicio, fim]
                };
            } else if (periodo === "semana") {
                inicio.setDate(inicio.getDate() - 6);

                where.createdAt = {
                    [Op.between]: [inicio, fim]
                };
            }

            
            const lista = await Paciente.findAll({
                where,
                include: [
                    {
                        model: Exame,
                        as: "Exames",
                        attributes: ["id", "data_realizacao"],
                        separate: true,
                        order: [["data_realizacao", "DESC"]],
                        
                        include: [
                            {
                                model: Processamento,
                                as: "Processamentos",
                                attributes: ["id"]
                            }   
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            });
            const pacientesFormatados = lista.map((paciente) => {
            const dadosPaciente = paciente.toJSON();

                dadosPaciente.Exames = dadosPaciente.Exames.map((exame) => {
                    return {
                        ...exame,
                        data_realizacao_formatada: formatarData(exame.data_realizacao)
                    };
                });

                return dadosPaciente;
            });

            return res.render(
                "partials/cards-pacientes",
                { lista: pacientesFormatados }
            );
        } catch (erro) {
            console.error("Erro ao filtrar pacientes:", erro);

            return res.status(500).send(
                "Não foi possível filtrar os pacientes."
            );
        }
    }
);


router.get("/consultas/filtrar", autenticado, carregarMedico, (req, res) => {
    const arquivadas = req.query.arquivadas === "true";
    const status = arquivadas ? "Arquivado" : "Disponível";  

    buscarExame(status, req.query, req.medico.id)
        .then((exames) => {
            return res.render("partials/linhas-consultas", {
                exames: prepararExames(exames),
                arquivadas
            });
        })
        .catch((error) => {
            console.error("Erro ao filtrar consultas:", error);
            return res
                .status(500)
                .send('<tr><td colspan="5" class="centro">Erro ao filtrar.</td></tr>');
        });
});

export default router;