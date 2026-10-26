import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import buscarExame from "../utils/buscarExame.js";
import Paciente from "../models/Paciente.js";

import Exame from "../models/Exame.js";

import express from "express";

const router = express.Router();

// Rota para listar pacientes disponíveis
router.get("/pacientes", autenticado, carregarMedico, (req, res) => {
    Paciente.findAll({
        where: { status_visualizacao: "Disponível" }
    })
    .then((pacientes) => {
        return res.render("pacientes", { 
            pacientes: pacientes,
            subtitulo: "Pacientes Cadastrados",
            médico: req.medico
        });
    })
    .catch((error) => {
        console.log(`Ocorreu um erro ao listar os pacientes. ERRO: ${error}`);
        return res.status(500).send("Erro interno do servidor");
    });
});

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


// Rota para visualizar prontuário
router.get("/pacientes/:id", autenticado, carregarMedico, (req, res) => {
    const idPaciente = req.params.id;

    Exame.findOne({
        where: { id_paciente: idPaciente },
        order: [['data_realizacao', 'DESC']]
    })
        .then((exameDb) => {
            if (!exameDb) {
                return res.status(404).send("Nenhum exame encontrado para este paciente.");
            }

            return res.render("resultados", {
                exame: exameDb,
                subtitulo: "Prontuário e Resultados"
            });
        })
        .catch((error) => {
            console.error(`Erro ao visualizar prontuário. ERRO: ${error}`);
            return res.status(500).send("Erro interno do servidor");
        });
});

export default router;