import express from "express";
import Medico from "../models/Medico.js";
import validarCPF from "../utils/validarCPF.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = "chave-secreta";

const router = express.Router();

router.post("/cadastro/medico", (req, res) => {
  const { cpf, nascimento, nome, crm, cep, endereco, email, senha } = req.body;

  if (!cpf || !crm || !nome || !senha || !email) {
    return res.status(400).send(
      "Preencha todos os dados obrigatórios!"
    );
  }

  if (!validarCPF(cpf)) {
    return res.status(400).send(
      "Forneça um CPF válido!"
    );
  }

  const emailNormalizado = email.trim().toLowerCase();

  Medico.findOne({
    where: {
      email: emailNormalizado,
    },
  })
    .then((medicoExistente) => {
      if (medicoExistente == undefined){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);

        Medico.create({
          cpf: cpf,
          nome: nome,
          email: emailNormalizado,
          crm: crm,
          data_nasc: nascimento || null,
          cep: cep || null,
          senha: hash
        }).then(() => {
          res.redirect("/");
        }).catch((error) => {
          console.log(`Erro ao cadastrar o médico: ${error}`);
          res.status(500).send("Erro ao cadastrar o médico.");
        });
      } else {
        console.log(`Erro ao cadastrar o médico: E-mail já em uso.`);
        res.status(400).send("O e-mail fornecido já está em uso!");
      }
    })
});

router.post("/login/medico", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send(
      "Preencha todos os dados obrigatórios!"
    );
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
        return res.status(401).send(
          "Credenciais inválidas!"
        );
      }

      const { medico, isMatch } = resultado;

      if (!isMatch) {
        return res.status(401).send(
          "Credenciais inválidas!"
        );
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

      return res.status(500).send(
        "Falha interna ao fazer login."
      );
    });
});

export default router;
