import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(file.mimetype)) {
            const erro = new Error("Formato de imagem não permitido.");
            erro.code = "INVALID_IMAGE_FORMAT";

            return cb(erro);
        }

        cb(null, true);
    }
});

export default upload;