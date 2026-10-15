import autenticado from "../utils/autenticado.js";
import calcularIdade from "../utils/calcularIdade.js";
import formatarData from "../utils/formatarData.js";
import Exame from "../models/Exame.js";
import Paciente from "../models/Paciente.js";
import Processamento from "../models/Processamento.js";
import Medico from "../models/Medico.js";
import express from "express";

const router = express.Router();

router.get("/home", autenticado, (req, res) => {
    Medico.findOne({
        where: {
            id: req.medico.id
        }
    })
    .then((medico) => {
        if (!medico) {
            return res.status(404).send("Médico não encontrado");
        }

        return Exame.findAll({
            where: {
                id_medico: req.medico.id,
                status_visualizacao: "Disponível"
            },
            include: [
                {
                    model: Paciente,
                    as: "Paciente",
                    attributes: ["id", "nome", "data_nasc"]
                },
                {
                    model: Processamento,
                    as: "Processamentos",
                    attributes: ["id", "resultado"]
                }
            ],
            order: [["data_realizacao", "DESC"]]
        })
        .then((exames) => {
            const dadosExames = exames.map((exame) => {
                const dados = exame.toJSON();

                if (dados.Paciente?.data_nasc) {
                    dados.Paciente.idade = calcularIdade(dados.Paciente.data_nasc);
                }

                if (dados.data_realizacao) {
                    dados.data_realizacao = formatarData(dados.data_realizacao);
                }

                return dados;
            });

            return res.render("home", {
                medico: medico,
                exames: dadosExames,
                arquivadas: false
            });
        });
    })
    .catch((error) => {
        console.error("Erro ao buscar dados da home:", error);
        return res.status(500).send("Erro interno do servidor");
    });
});

router.get("/consultas/arquivadas", autenticado, (req, res) => {
    Medico.findOne({
        where: { id: req.medico.id }
    })
    .then((medico) => {
        if (!medico) {
            return res.status(404).send("Médico não encontrado");
        }

        return Exame.findAll({
            where: {
                id_medico: req.medico.id,
                status_visualizacao: "Arquivado"  
            },
            include: [
                {
                    model: Paciente,
                    as: "Paciente",
                    attributes: ["id", "nome", "data_nasc"]
                },
                {
                    model: Processamento,
                    as: "Processamentos",
                    attributes: ["id", "resultado"]
                }
            ],
            order: [["data_realizacao", "DESC"]]
        })
        .then((exames) => {
            const dadosExames = exames.map((exame) => {
                const dados = exame.toJSON();

                if (dados.Paciente?.data_nasc) {
                    dados.Paciente.idade = calcularIdade(dados.Paciente.data_nasc);
                }
                if (dados.data_realizacao) {
                    dados.data_realizacao = formatarData(dados.data_realizacao);
                }
                return dados;
            });

            return res.render("home", {
                medico: medico,
                exames: dadosExames,
                arquivadas: true
            });
        });
    })
    .catch((error) => {
        console.error("Erro ao buscar consultas arquivadas:", error);
        return res.status(500).send("Erro interno do servidor");
    });
});

router.post("/consultas/:id/arquivar", autenticado, (req, res) => {
    const exameId = req.params.id;
    Exame.findByPk(exameId).then((exame) => {
        if (!exame){
            return res.status(404).json({ message: "Exame não encontrado." });
        } else {
            exame.update({ status_visualizacao: "Arquivado" }).then(() => {
                return res.redirect("/home");
            });
        }
    }).catch((error) => {
        console.error("Erro ao arquivar exame:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    })
});

router.post("/consultas/:id/desarquivar", autenticado, (req, res) => {
    const exameId = req.params.id;
    Exame.findByPk(exameId).then((exame) => {
        if (!exame){
            return res.status(404).json({ message: "Exame não encontrado." });
        } else {
            exame.update({ status_visualizacao: "Disponível" }).then(() => {
                return res.redirect("/home");
            });
        }
    }).catch((error) => {
        console.error("Erro ao desarquivar exame:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    })
});

export default router;