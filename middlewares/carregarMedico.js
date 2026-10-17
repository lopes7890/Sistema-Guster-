import Medico from "../models/Medico.js";

function carregarMedico(req, res, next) {
    Medico.findOne({
        where: {
            id: req.medico.id
        }
    })
        .then((medico) => {
            if (!medico) {
                return res.status(404).send("Médico não encontrado");
            }

            res.locals.medico = medico;

            next();
        })
        .catch((error) => {
            console.error("Erro ao carregar médico:", error);

            return res.status(500).send("Erro interno do servidor");
        });
}

export default carregarMedico;
