import multer from "multer";

function tratarErroUpload (uploadMiddleware, redirecionamento) {
    return (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (!err) {
                return next();
            }

            console.error("Erro no upload:", err);

            if (err instanceof multer.MulterError) {
                switch (err.code) {
                    case "LIMIT_FILE_SIZE":
                        req.flash(
                            "danger",
                            "A imagem deve ter no máximo 5 MB!"
                        );
                        break;

                    case "LIMIT_UNEXPECTED_FILE":
                        req.flash(
                            "danger",
                            "Arquivo enviado em um campo inválido."
                        );
                        break;

                    default:
                        req.flash(
                            "danger",
                            "Ocorreu um erro ao enviar o arquivo."
                        );
                }
            } else if (err.code === "INVALID_IMAGE_FORMAT") {
                req.flash(
                    "danger",
                    "Formato inválido! Envie uma imagem JPEG, PNG ou WebP."
                );
            } else {
                req.flash(
                    "danger",
                    "Não foi possível enviar o arquivo."
                );
            }

            return res.redirect(
                typeof redirecionamento === "function"
                    ? redirecionamento(req)
                    : redirecionamento
            );
        });
    };
};

export default tratarErroUpload;