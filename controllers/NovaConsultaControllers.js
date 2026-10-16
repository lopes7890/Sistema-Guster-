import express from "express";

import connection from "../config/config.js";

import Medico from "../models/Medico.js";
import autenticado from "../utils/autenticado.js";

const router = express.Router();

router.get("/consulta/nova", autenticado, (req, res) => {
    Medico.findOne({ where: { id: req.medico.id } })
        .then((medico) => {
            if (!medico) {
                return res.status(404).send("Médico não encontrado");
            }

            return res.render("conexaoBCI", {
                medico: medico,
                mostrarNovaConsulta: false
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar nova consulta:", error);
            return res.status(500).send("Erro interno do servidor");
        });
});

router.get("/exameBCI", autenticado, (req, res) => {
    Medico.findOne({ where: { id: req.medico.id } })
        .then((medico) => {
            if (!medico) {
                return res.status(404).send("Médico não encontrado");
            }

            return res.render("exameBCI", {
                medico: medico,
                mostrarNovaConsulta: false
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar nova consulta:", error);
            return res.status(500).send("Erro interno do servidor");
        });
});

export default router;