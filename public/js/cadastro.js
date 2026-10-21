(function () {
    var formatadores = {
        cpf: function (valor) {
            return valor
                .replace(/\D/g, '')
                .slice(0, 11)
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        },
 
        cep: function (valor) {
            var d = valor.replace(/\D/g, '').slice(0, 8);
            return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
        },
 
        crm: function (valor) {
            var limpo = valor.toUpperCase().replace(/[^0-9A-Z]/g, '');
            var partes = limpo.match(/^(\d{0,7})([A-Z]{0,2})/);
            var numero = partes[1];
            var uf = partes[2];
 
            if (!numero) return '';
            return uf ? numero + '/' + uf : numero;
        },
        telefone: function (valor) {
            var d = valor.replace(/\D/g, '').slice(0, 11);
 
            if (d.length === 0) return '';
            if (d.length <= 2) return '(' + d;
            if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
            if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
            return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
        }
    };
 
    function ehSignificativo(caractere) {
        return /[0-9A-Za-z]/.test(caractere);
    }
 
    function aplicarMascara(input) {
        var formatar = formatadores[input.dataset.mascara];
        if (!formatar) return;
 
        var focado = document.activeElement === input;
        var posicao = focado ? input.selectionStart : 0;
 
        var antes = 0;
        if (focado) {
            input.value.slice(0, posicao).split('').forEach(function (c) {
                if (ehSignificativo(c)) antes++;
            });
        }
 
        input.value = formatar(input.value);
 
        if (focado) {
            var novaPosicao = 0;
            var contados = 0;
            while (novaPosicao < input.value.length && contados < antes) {
                if (ehSignificativo(input.value[novaPosicao])) contados++;
                novaPosicao++;
            }
            input.setSelectionRange(novaPosicao, novaPosicao);
        }
    }
 
    document.querySelectorAll('[data-mascara]').forEach(function (input) {
        input.addEventListener('input', function () { aplicarMascara(input); });
        aplicarMascara(input); 
    });
})();