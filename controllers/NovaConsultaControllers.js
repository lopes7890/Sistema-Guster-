import express from "express";
import Sequelize from "sequelize";

import connection from "../config/config.js";

import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import validarCPF from "../utils/validarCPF.js";

import Paciente from "../models/Paciente.js";
import TelefonesPaciente from "../models/TelefonesPaciente.js";
import Sintoma from "../models/Sintoma.js";
import PacienteSintoma from "../models/PacienteSintoma.js";
import Exame from "../models/Exame.js";
import Aparelho from "../models/Aparelho.js";
import Processamento from "../models/Processamento.js";

const router = express.Router();

router.get("/consulta/nova", autenticado, carregarMedico, (req, res) => {
    return res.render("novaConsulta", {
        mostrarNovaConsulta: false,
        subtitulo: "Nova Consulta"
    });
});

router.get("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
    const {id_paciente} = req.query
    return res.render("informacoesConsulta", {
        mostrarNovaConsulta: false,
        id_paciente: id_paciente,
        subtitulo: "Nova Consulta"
    });
});

router.get("/consulta/conexaoBCI", autenticado, carregarMedico, (req, res) => {
    const {id_paciente} = req.query;
    return res.render("conexaoBCI", {
        mostrarNovaConsulta: false,
        id_paciente: id_paciente,
        subtitulo: "Nova Consulta"
    });
});

router.get("/consulta/exameBCI/:id_paciente", autenticado, carregarMedico, (req, res) => {
    return res.render("exameBCI", {
        mostrarNovaConsulta: false,
        id_paciente: req.params.id_paciente,
        subtitulo: "Nova Consulta"
    });
});

// ROTAs DE SIMULAÇÃO DE RESULTADOS DO EXAME
router.get("/resultados/:id_paciente", autenticado, carregarMedico, (req, res) => {
    const id_paciente = req.params.id_paciente;

    Aparelho.findByPk(1).then((aparelho) => {
        if(aparelho){
            Exame.create({
                data_realizacao: new Date(),
                id_aparelho: aparelho.id,
                id_paciente: id_paciente,
                id_medico: req.medico.id
            }).then((exame) => {
                Processamento.create({
                    resultado: "Hipogeusia",
                    descricao: `O paciente apresenta indícios de hipogeusia, condição caracterizada pela redução da capacidade 
                                de perceber os sabores. Durante a avaliação, foram relatadas alterações na percepção gustativa, 
                                possivelmente associadas às sequelas da infecção por COVID-19. Os resultados preliminares da análise dos sinais cerebrais 
                                captados pela interface cérebro-computador (BCI), em conjunto com as informações clínicas e os sintomas relatados, sugerem uma possível diminuição da sensibilidade gustativa.
                                Recomenda-se a realização de uma avaliação clínica especializada e de testes gustativos padronizados para confirmar a presença e determinar o grau da alteração. 
                                Este resultado possui caráter preliminar e não constitui um diagnóstico médico definitivo.`,
                    percentual_doce: 0.25,
                    percentual_amargo: 0.30,
                    id_exame: exame.id         
                }).then((processamento) => {
                    return res.redirect(`/consulta/resultado?id_processamento=${processamento.id}`);
                }).catch((error) => {
                    console.log(`Falha ao buscar os resultados. Erro: ${error}`);
                    return res.status(500).send("Falha ao buscar resultados");
                });
            });
        } else {
            return res.status(500).send("Dispositivo não identificado");
        };
    });
});

router.get("/consulta/resultado", autenticado, carregarMedico, (req, res) => {
    const {id_processamento} = req.query;
    res.send(id_processamento);
});
// ==================================================================


router.post("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
    const {dataCovid, capacidadeSabor, diferencaPaladar, primeiraPercepcao, alteracaoCovid, id_paciente} = req.body;
    if(!dataCovid || !capacidadeSabor || !diferencaPaladar || !primeiraPercepcao || !alteracaoCovid || !id_paciente){
        return res.status(400).send("Preencha todos os campos!");
    }

    Sintoma.create({
        data_cov: dataCovid,
        escala_0_10: Number(capacidadeSabor),
        diferenca_no_paladar: diferencaPaladar,
        alteracao_primeira_vez: primeiraPercepcao,
        alteracao_durante_covid: alteracaoCovid
    }).then((sintoma) => {
        PacienteSintoma.create({
            id_paciente: id_paciente,
            id_sintoma: sintoma.id
        }).then(() => {
            return res.redirect(`/consulta/conexaoBCI?id_paciente=${id_paciente}`);
        }).catch((error) => {
            console.log(`Falha ao cadastrar os sintomas ${error}`);
            return res.status(500).send(`Falha ao cadastrar os sintomas ${error}`);
        });
    });
});


router.post("/pacientes/novo", autenticado, carregarMedico, (req, res) => {
    const { nome, nascimento, telefone, cpf, endereco, cep, email } = req.body;

    if (!nome || !nascimento || !telefone || !cpf || !endereco || !cep || !email) {
        return res.status(400).send("Preencha todos os campos!");
    }

    if (!validarCPF(cpf)) {
        return res.status(400).send("Forneça um CPF válido!");
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = cpf.trim();

    Paciente.findOne({
        where: {
            [Sequelize.Op.or]: [
                { cpf: cpfNormalizado },
                { email: emailNormalizado }
            ]
        }
    })
    .then((pacienteExistente) => {

        if (pacienteExistente) {
            return PacienteSintoma.findOne({
                where: {
                    id_paciente: pacienteExistente.id
                }
            })
            .then((pacienteComSintoma) => {

                if (pacienteComSintoma) {
                    return res.redirect(`/consulta/conexaoBCI?id_paciente=${pacienteExistente.id}`);
                }

                return res.redirect(`/consulta/informacoes?id_paciente=${pacienteExistente.id}`);
            });
        }

        return Paciente.create({
            nome: nome,
            email: emailNormalizado,
            cpf: cpfNormalizado,
            data_nasc: nascimento,
            endereco: endereco,
            cep: cep
        })
        .then((paciente) => {
            return TelefonesPaciente.create({
                id_paciente: paciente.id,
                telefone: telefone
            })
            .then(() => {
                return res.redirect(`/consulta/informacoes?id_paciente=${paciente.id}`);
            });
        });
    })
    .catch((error) => {
        console.error("Erro ao cadastrar ou consultar paciente:", error);
        return res.status(500).send("Falha ao processar o paciente. Tente novamente!");
    });
});




export default router;