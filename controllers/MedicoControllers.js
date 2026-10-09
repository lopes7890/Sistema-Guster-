import express from "express";
import Medico from "../models/Medico.js"
import validarCPF from "../utils/validarCPF.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/cadastro/medico", (req, res) => {
  const { cpf, nascimento, nome, crm, cep, endereco, email, senha } = req.body;

  if (!cpf || !crm || !nome || !senha || !email) {
    return res.status(400).json({
      message: "Preencha todos os dados obrigatórios!",
    });
  }

  if (!validarCPF(cpf)) {
    return res.status(400).json({
      message: "Forneça um CPF válido!",
    });
  }

  const emailNormalizado = email.trim().toLowerCase();

  Medico.findOne({
    where: {
      email: emailNormalizado,
    },
  })
    .then((medicoExistente) => {
      if (medicoExistente) {
        return res.status(409).json({
          message: "E-mail já cadastrado!",
        });
      }

      return bcrypt.hash(senha, 10);
    })
    .then((senhaHash) => {
      if (res.headersSent) {
        return;
      }

      return Medico.create({
        nome: nome,
        cpf: cpf,
        email: emailNormalizado,
        crm: crm,
        data_nasc: nascimento || null,
        endereco: endereco || null,
        cep: cep || null,
        senha: senhaHash,
      });
    })
    .then((medico) => {
      if (res.headersSent || !medico) {
        return;
      }

      return res.status(201).json({
        message: "Médico cadastrado com sucesso!",
      });
    })
    .catch((error) => {
      console.error("Erro ao cadastrar médico:", error);

      if (res.headersSent) {
        return;
      }

      return res.status(500).json({
        message: "Falha interna ao cadastrar médico.",
      });
    });
});

export default router;
