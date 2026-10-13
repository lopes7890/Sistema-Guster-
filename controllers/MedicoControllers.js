import express from "express";
import Medico from "../models/Medico.js"
import validarCPF from "../utils/validarCPF.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import autenticado from "../utils/autenticado.js";

const JWT_SECRET = "chave-secreta";

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

router.post("/login/medico", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Preencha todos os dados obrigatórios!",
    });
  }

  const emailNormalizado = email.trim().toLowerCase();

  Medico.findOne({
    where: {
      email: emailNormalizado,
    },
  })
    .then((medico) => {
      if (!medico) {
        return null;
      }

      return bcrypt.compare(senha, medico.senha)
        .then((isMatch) => ({
          medico,
          isMatch,
        }));
    })
    .then((resultado) => {
      if (!resultado) {
        return res.status(401).json({
          message: "Credenciais inválidas!",
        });
      }

      const { medico, isMatch } = resultado;

      if (!isMatch) {
        return res.status(401).json({
          message: "Credenciais inválidas!",
        });
      }

      const token = jwt.sign(
        {
          id: medico.id,
          email: medico.email,
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.cookie("token", token, 
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 8 * 60 * 60 * 1000
        })
        .redirect("/home");
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error);

      return res.status(500).json({
        message: "Falha interna ao fazer login.",
      });
    });
});

export default router;
