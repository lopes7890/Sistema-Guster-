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

const router = express.Router();

router.get("/consulta/nova", autenticado, carregarMedico, (req, res) => {
    return res.render("novaConsulta", {
        mostrarNovaConsulta: false
    });
});

router.get("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
    const {id_paciente} = req.query
    return res.render("informacoesConsulta", {
        mostrarNovaConsulta: false,
        id_paciente: id_paciente
    });
});

router.get("/consulta/conexaoBCI", autenticado, carregarMedico, (req, res) => {
    const {id_paciente, id_sintoma} = req.query;
    console.log(id_paciente, id_sintoma)
    return res.render("conexaoBCI", {
        mostrarNovaConsulta: false,
        id_paciente: id_paciente,
        id_sintoma: id_sintoma
    });
});

router.get("/consulta/exameBCI/:id_paciente/:id_sintoma", autenticado, carregarMedico, (req, res) => {
    return res.render("exameBCI", {
        mostrarNovaConsulta: false,
        id_paciente: req.params.id_paciente,
        id_sintoma: req.params.id_sintoma
    });
});

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
            return res.redirect(`/consulta/conexaoBCI?id_paciente=${id_paciente}&id_sintoma=${sintoma.id}`);
        }).catch((error) => {
            console.log(`Falha ao cadastrar os sintomas ${error}`);
            return res.status(500).send(`Falha ao cadastrar os sintomas ${error}`);
        });
    });
});

router.post("/pacientes/novo", autenticado, carregarMedico, (req, res) => {
    const {nome, nascimento, telefone, cpf, endereco, cep, email} = req.body;
    if (!nome || !nascimento || !telefone || !cpf || !endereco|| !cep || !email){
        return res.status(400).send("Preencha todos os campos!");
    }

    if(!validarCPF(cpf)){
        return res.status(400).send("Forneça um CPF válido!");
    }

    const emailNormalizado = email.trim().toLowerCase();

    Paciente.findOne({
        where: {
            [Sequelize.Op.or]: [
                { cpf: cpf },
                { email: email }
            ]
        }
    })
    .then((pacienteExistente) => {
        if(pacienteExistente == undefined){
            Paciente.create({
                nome: nome,
                email: emailNormalizado,
                cpf: cpf,
                data_nasc: nascimento,
                endereco: endereco,
                cep: cep
            })
            .then(paciente => {
                return TelefonesPaciente.create({
                    id_paciente: paciente.id,
                    telefone: telefone
                }).then(() => {
                    return res.redirect(`/consulta/informacoes?id_paciente=${paciente.id}`);
                }).catch((error) => {
                    console.log(`Erro ao cadastrar o paciente: ${error}`);
                    return res.status(500).send("Falha ao cadastrar paciente, tente novamente!");
                })
            })
        } else {
            console.log("Paciente já cadastrado");
            return res.status(400).send("Paciente já cadastrado no sistema!");
        }
    });
});



export default router;