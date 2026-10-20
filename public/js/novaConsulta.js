var inputFoto = document.getElementById("foto");
var textoFoto = document.getElementById("foto-texto");
var botaoRemover = document.getElementById("foto-remover");
var TEXTO_PADRAO = "Adicionar foto (opcional)";

inputFoto.addEventListener("change", function () {
  var temArquivo = inputFoto.files.length > 0;
  textoFoto.textContent = temArquivo ? inputFoto.files[0].name : TEXTO_PADRAO;
  botaoRemover.hidden = !temArquivo;
});

botaoRemover.addEventListener("click", function () {
  inputFoto.value = "";
  textoFoto.textContent = TEXTO_PADRAO;
  botaoRemover.hidden = true;
  inputFoto.focus({ preventScroll: true });
});
