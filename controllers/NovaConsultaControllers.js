import express from "express";

import connection from "../config/config.js";

import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import validarCPF from "../utils/validarCPF.js";

import Paciente from "../models/Paciente.js";
import TelefonesPaciente from "../models/TelefonesPaciente.js";

const router = express.Router();

router.get("/consulta/nova", autenticado, carregarMedico, (req, res) => {
    return res.render("novaConsulta", {
        mostrarNovaConsulta: false
    });
})

router.get("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
    return res.render("informacoesConsulta", {
        mostrarNovaConsulta: false,
        id_paciente: req.query
    });
})

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
            cpf: cpf
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
                    return res.redirect(`/consulta/informacoes?id_paciente=${paciente.id}`)
                }).catch((error) => {
                    console.log(`Erro ao cadastrar o paciente: ${error}`);
                    return res.status(500).send("Falha ao cadastrar paciente, tente novamente!");
                })
            })
        } else {
            console.log("Paciente já cadastrado");
            return res.status(400).send("Paciente já cadastrado no sistema!");
        }
    })
}) 


export default router;