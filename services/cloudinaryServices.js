import cloudinary from "../config/cloudinary.js";

function enviarPDFCloudinary(buffer, publicId) {
    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "guster/relatorios",
                public_id: publicId,
                overwrite: true,
            },
            (error, resultado) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    url: resultado.secure_url,
                    publicId: resultado.public_id,
                });
            }
        );

        upload.end(buffer);
    });
}

export default enviarPDFCloudinary;