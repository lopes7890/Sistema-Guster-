import express from "express";
import multer from "multer";
import autenticado from "../middlewares/autenticado.js";
import Medico from "../models/Medico.js";
import carregarMedico from "../middlewares/carregarMedico.js";

const router = express.Router();

// Configuração do Multer para salvar imagens na pasta public/uploads
const upload = multer({ dest: "public/uploads/" });

// Rota configurações
router.get("/configuracoes", autenticado, carregarMedico, (req, res) => {
    const id = req.medico.id;
    if (!id) {
        return res.redirect("/login");
    }
    res.redirect(`/configuracoes/${id}`);
});

// Rota Configurações com ID
router.get("/configuracoes/:id", autenticado, carregarMedico, (req, res) => {
    const id = req.params.id;
    
    Medico.findByPk(id).then(function(medico){
        if (!medico) {
            return res.redirect("/");
        }
        res.render("configuracoes", {
            perfil: medico,
            medico: medico,     
            subtitulo: "Editar Dados"
        });
    }).catch((error) => {
        console.log(`Erro ao buscar médico. Erro: ${error}`);
        res.redirect("/");
    });
});

// Rota POST com upload.single('foto') para processar os textos e a imagem
router.post("/configuracoes/editar/:id", autenticado, upload.single('foto'), (req, res) => {
    const id = req.params.id;
    
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
        data_nasc: nascimento,
        endereco: `${logradouro || ''}, ${numero || ''}`.trim()
    };

    // Se o usuário enviou uma foto nova, atualiza o campo foto
    if (req.file) {
        dadosAtualizados.foto = `/uploads/${req.file.filename}`;
    }

    Medico.update(dadosAtualizados, { 
        where: { id: id } 
    }).then(() => {
        res.redirect(`/configuracoes/${id}`);
    }).catch((error) => {
        console.log(`Erro ao atualizar. Erro ${error}`);
        res.redirect(`/configuracoes/${id}`);
    });
});

export default router;