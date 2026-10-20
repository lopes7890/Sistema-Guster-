function excluirFoto(req) {
    if (req.file) {
        fs.unlink(req.file.path, (erro) => {
            if (erro) {
                console.error("Erro ao excluir foto:", erro);
            } else {
                console.log("Foto temporária excluída.");
            }
        });
    }
}

export default excluirFoto;