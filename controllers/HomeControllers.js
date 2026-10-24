import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import buscarExame from "../utils/buscarExame.js";
import prepararExames from "../utils/prepararExames.js";


import Exame from "../models/Exame.js";

import express from "express";

const router = express.Router();

router.get("/home", autenticado, carregarMedico, (req, res) => {
    buscarExame("Disponível", {}, req.medico.id)            
        .then((exames) => {
            return res.render("home", {
                exames: prepararExames(exames),
                arquivadas: false,
                mostrarNovaConsulta: true,  
                subtitulo: "Painel Central"
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar dados da home:", error);
            return res.status(500).send("Erro interno do servidor");
        });
});

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

router.get("/consultas/arquivadas", autenticado, carregarMedico, async (req, res) => {
    try {
        const exames = await buscarExame("Arquivado", {}, req.medico.id);
        return res.render("home", {
            exames: prepararExames(exames),
            arquivadas: true,
            mostrarNovaConsulta: true,
            subtitulo: "Painel Central",
        });
    } catch (error) {
        console.error("Erro ao buscar consultas arquivadas:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

router.post("/consultas/:id/arquivar", autenticado, (req, res) => {
  const exameId = req.params.id;
  Exame.findByPk(exameId)
    .then((exame) => {
      if (!exame) {
        return res.status(404).send("Exame não encontrado.");
      } else {
        exame.update({ status_visualizacao: "Arquivado" }).then(() => {
          return res.redirect("/home");
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao arquivar exame:", error);
      return res.status(500).send("Erro interno do servidor.");
    });
});

router.post("/consultas/:id/desarquivar", autenticado, (req, res) => {
  const exameId = req.params.id;
  Exame.findByPk(exameId)
    .then((exame) => {
      if (!exame) {
        return res.status(404).send("Exame não encontrado." );
      } else {
        exame.update({ status_visualizacao: "Disponível" }).then(() => {
          return res.redirect("/home");
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao desarquivar exame:", error);
      return res.status(500).send("Erro interno do servidor.");
    });
});

export default router;
