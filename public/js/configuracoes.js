const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("preview-foto");

inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido.");
        inputFoto.value = "";
        return;
    }

    const urlFoto = URL.createObjectURL(arquivo);

    previewFoto.src = urlFoto;
});