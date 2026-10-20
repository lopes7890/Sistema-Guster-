import cloudinary from "../config/cloudinary.js";

function uploadFoto(arquivo) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "pacientes",
                resource_type: "image"
            },
            (erro, resultado) => {
                if (erro) {
                    return reject(erro);
                }

                resolve({
                    url: resultado.secure_url,
                    publicId: resultado.public_id
                });
            }
        );

        stream.end(arquivo.buffer);
    });
}

export default uploadFoto;