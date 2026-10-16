const botao = document.getElementById('btn-confirma')
botao.addEventListener("click", () => {
    const textoAmostraDoce = document.getElementById('doce');
    const textoOrientacao = document.getElementById('texto-orientacao');
    const textoOrientacao2 = document.getElementById('texto-orientacao-2');
    const iconeCheck = document.getElementById('icone-check');
    const textoAmostraAmargo = document.getElementById('amargo');
    const botao2 = document.getElementById('btn-confirma-2');

    textoAmostraDoce.textContent = 'Amostra de sabor doce: Confirmado';
    textoAmostraDoce.style.color = '#005F23';
    textoOrientacao.style.display = 'none';
    iconeCheck.style.display = 'inline'
    botao.style.display = 'none';
    textoAmostraAmargo.textContent = 'Amostra de sabor amargo: Aguardando Confirmação...';
    textoOrientacao2.style.display = 'block';
    textoAmostraAmargo.style.color = '#090E18';
    botao2.style.display = 'block';

});

const botao2 = document.getElementById('btn-confirma-2');

botao2.addEventListener("click", () => {
    const iconeCheck = document.getElementById('icone-check-2');
    const textoAmostraAmargo = document.getElementById('amargo');
    const textoOrientacao = document.getElementById('texto-orientacao-2');
    const botaoResultado = document.getElementById('resultados');

    textoAmostraAmargo.textContent = 'Amostra de sabor amargo: Confirmado';
    textoAmostraAmargo.style.color = '#005F23';
    textoOrientacao.style.display = 'none';
    iconeCheck.style.display = 'inline';
    botao2.style.display = 'none';
    botaoResultado.style.display = 'block'
})