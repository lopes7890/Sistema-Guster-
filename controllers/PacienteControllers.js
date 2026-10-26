import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";
import contagemDiagnostico from "../middlewares/contagemDiagostico.js";

import Paciente from "../models/Paciente.js";
import Processamento from "../models/Processamento.js";
import Exame from "../models/Exame.js";

import formatarData from "../utils/formatarData.js";

import express from "express";

const router = express.Router();

// Rota para listar pacientes disponíveis
router.get("/pacientes", autenticado, carregarMedico, contagemDiagnostico, (req, res) => {
        Paciente.findAll({
            where: {
                status_visualizacao: "Disponível"
            },
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
            ]
        })
            .then((pacientes) => {
                const pacientesFormatados = pacientes.map((paciente) => {
                    const dadosPaciente = paciente.toJSON();

                    dadosPaciente.Exames = dadosPaciente.Exames.map((exame) => ({
                        ...exame,
                        data_realizacao_formatada: formatarData(
                            exame.data_realizacao
                        )
                    }));

                    return dadosPaciente;
                });

                return res.render("pacientes", {
                    pacientes: pacientesFormatados,
                    subtitulo: "Pacientes Cadastrados",
                    médico: req.medico,
                    filtro: "todos",
                    contagem: res.locals.contagem,
                    mostrarNovaConsulta: true
                });
            })
            .catch((error) => {
                console.error("Erro ao listar pacientes:", error);

                return res.status(500).send("Erro interno do servidor");
            });
    }
);

// Rota para listar pacientes arquivados
router.get("/pacientes/arquivados", autenticado, carregarMedico, (req, res) => {
    Paciente.findAll({
        where: { status_visualizacao: "Arquivado" }
    })
    .then((pacientesArquivados) => {
        return res.render("pacientesArquivados", { 
            pacientes: pacientesArquivados,
            subtitulo: "Pacientes Arquivados",
            médico: req.medico
        });
    })
    .catch((error) => {
        console.log(`Ocorreu um erro ao listar pacientes arquivados. ERRO: ${error}`);
        return res.status(500).send("Erro interno do servidor");
    });
});

// Rota para arquivar o paciente
router.post("/pacientes/:id/arquivar", autenticado, carregarMedico, (req, res) => {
    Paciente.update(
        { status_visualizacao: "Arquivado" },
        { where: { id: req.params.id } }
    )
    .then(() => {
        return res.redirect("/pacientes");
    })
    .catch((error) => {
        console.log(`Erro ao arquivar paciente. ERRO: ${error}`);
    });
});

// Rota para desarquivar o paciente
router.post("/pacientes/:id/desarquivar", autenticado, carregarMedico, (req, res) => {
    Paciente.update(
        { status_visualizacao: "Disponível" },
        { where: { id: req.params.id } }
    )
    .then(() => {
        return res.redirect("/pacientes/arquivados");
    })
    .catch((error) => {
        console.log(`Erro ao desarquivar paciente. ERRO: ${error}`);
    });
});


//Rota para visualizar prontuário
router.get("/pacientes/:id", autenticado, carregarMedico, async (req, res) => {
    try {
        const idPaciente = req.params.id;

        const exameDb = await Exame.findOne({
            where: { id_paciente: idPaciente },
            order: [['data_realizacao', 'DESC']]
        });

        if (!exameDb) {
            return res.status(404).send("Nenhum exame encontrado para este paciente.");
        }

        return res.render("resultados", {
            exame: exameDb,
            subtitulo: "Prontuário e Resultados"
        });

    } catch (error) {
        console.error(`Erro ao visualizar prontuário. ERRO: ${error}`);
        return res.status(500).send("Erro interno do servidor");
    }
});

export default router;