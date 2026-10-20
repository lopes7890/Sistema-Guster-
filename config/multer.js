import multer from "multer";
import path from "path";
import fs from "fs";

const pastaUploads = path.resolve("uploads/pacientes");

fs.mkdirSync(pastaUploads, {recursive: true});

const tamanho = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaUploads);
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivado = `${Date.now()}-${Math.round(Math.round() * 1e9)}${extensao}`;

        cb(null, nomeArquivado);
    }
});

const upload = multer({
    tamanho,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];
        if (!tiposPermitidos.includes(file.mimetype)){
            return cb(new Error("Formato de imagem não permitido"));
        }
        cb(null, true);
    }
});

export default upload;