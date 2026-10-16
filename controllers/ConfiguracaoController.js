import express from "express";

import Medico from "../models/Medico.js";

import connection from "../config/config.js";
import autenticado from "../utils/autenticado.js";

const router = express.Router();

router.get('/configuracoes', autenticado, (req, res) => {
    Medico.findOne({ where: { id: req.medico.id } })
        .then((medico) => {
            if (!medico) {
                return res.status(404).send("Médico não encontrado");
            }

            return res.render("configuracoes", {
                medico: medico,
                mostrarNovaConsulta: true
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar nova consulta:", error);
            return res.status(500).send("Erro interno do servidor");
        });
});

export default router;