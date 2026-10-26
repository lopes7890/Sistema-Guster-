import express from "express";
import autenticado from "../middlewares/autenticado.js";
import Medico from "../models/Medico.js";
import carregarMedico from "../middlewares/carregarMedico.js";

import uploadFoto from "../utils/uploadFoto.js";
import upload from "../config/multer.js";

const router = express.Router();

// Rota de configurações
router.get("/configuracoes", autenticado, carregarMedico, (req, res) => {
    const id = req.medico.id;

    if (!id) {
        return res.redirect("/login");
    }

    return res.redirect(`/configuracoes/${id}`);
});

// Rota de configurações com ID
router.get("/configuracoes/:id", autenticado, carregarMedico, (req, res) => {
    const id = req.params.id;

    if (String(id) !== String(req.medico.id)) {
        return res.redirect("/configuracoes");
    }

    Medico.findByPk(id)
        .then(function (medico) {
            if (!medico) {
                return res.redirect("/");
            }

            return res.render("configuracoes", {
                perfil: medico,
                subtitulo: "Editar Dados"
            });
        })
        .catch((error) => {
            console.log(`Erro ao buscar médico. Erro: ${error}`);
            return res.redirect("/");
        });
});

// Rota para editar as configurações do médico
router.post("/configuracoes/editar/:id", autenticado, upload.single("foto"), (req, res) => {
        const id = req.params.id;

        if (String(id) !== String(req.medico.id)) {
            return res.redirect("/configuracoes");
        }

        const {
            nome,
            nascimento,
            email,
            telefone,
            cpf,
            logradouro,
            numero,
            cep,
            cidade,
            bairro
        } = req.body;

        const dadosAtualizados = {
            nome,
            email,
            cpf,
            telefone,
            cep,
            cidade,
            bairro,
            data_nasc: nascimento || null,
            endereco: [logradouro, numero]
                .filter(valor => valor && valor.trim())
                .join(", ")
        };

        const promessaFoto = req.file
            ? uploadFoto(req.file)
            : Promise.resolve(null);

        return promessaFoto
            .then((foto) => {
                if (foto) {
                    dadosAtualizados.foto = foto ? foto.url : null;
                }

                return Medico.update(dadosAtualizados, {
                    where: {
                        id: id
                    }
                });
            })
            .then(() => {
                return res.redirect(`/configuracoes/${id}`);
            })
            .catch((error) => {
                console.error("Erro ao atualizar configurações:", error);
                return res.redirect(`/configuracoes/${id}`);
            });
    }
);

export default router;