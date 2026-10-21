document.querySelectorAll('[data-alternar-senha]').forEach(function (botao) {
    var input = document.getElementById(botao.dataset.alternarSenha);
    if (!input) return;
 
    botao.addEventListener('click', function () {
        var mostrar = input.type === 'password';
 
        input.type = mostrar ? 'text' : 'password';
        botao.setAttribute('aria-pressed', mostrar);
    });
});