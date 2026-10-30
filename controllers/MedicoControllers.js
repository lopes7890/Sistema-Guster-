import express from "express";
import Medico from "../models/Medico.js";
import validarCPF from "../utils/validarCPF.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import autenticado from "../middlewares/autenticado.js";


const JWT_SECRET = "chave-secreta";

const router = express.Router();

router.post("/cadastro/medico", (req, res) => {
  const { cpf, nascimento, nome, crm, cep, endereco, email, senha, confirmarSenha } = req.body;

  if (!cpf || !crm || !nome || !senha || !email) {
    req.flash('danger', 'Preencha todos os dados obrigatórios!');
    return res.redirect("/cadastro");
  }

  if (!validarCPF(cpf)) {
    req.flash('danger', 'Forneça um CPF válido!');
    return res.redirect("/cadastro");
  }

  if (senha != confirmarSenha){
    req.flash('danger', 'As senhas fornecidas são diferentes!');
    return res.redirect('/cadastro');
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
          endereco: endereco,
          crm: crm,
          data_nasc: nascimento || null,
          cep: cep || null,
          senha: hash
        }).then(() => {
          req.flash('success', 'Cadastro realizado com sucesso!');
          return res.redirect("/");
        }).catch((error) => {
          console.log(`Erro ao cadastrar o médico: ${error}`);
          req.flash('danger', 'Erro ao cadastrar usuário! Tente novamente.');
          return res.redirect("/cadastro");
        });
      } else {
        console.log(`Erro ao cadastrar o médico: E-mail já em uso.`);
        
        req.flash('danger', 'O e-mail fornecido já está em uso!');
        return res.redirect("/cadastro");
      }
    })
});

router.post("/login/medico", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
        req.flash('danger', 'Preencha todos os campos!');
        return res.redirect("/");
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
        req.flash('danger', 'Usuário não cadastrado! Realize o cadastro e tente novamente.');
        return res.redirect("/");
      }

      const { medico, isMatch } = resultado;

      if (!isMatch) {
        req.flash('danger', 'Credenciais inválidas!');
        return res.redirect("/");
      }

      const token = jwt.sign(
        {
          id: medico.id,
          email: medico.email,
        },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      req.flash('success', 'Login efetuado com sucesso!');
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

      req.flash('danger', 'Falha interna ao fazer login.');
      return res.redirect("/");
    });
});

router.get("/logout", autenticado, (req, res) => {
  res.clearCookie("token");

  return res.redirect("/");
})

export default router;
