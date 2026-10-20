const tbody = document.getElementById("tabela-consultas");
const inBusca = document.querySelector('input[name="busca"]');
const selPer = document.querySelector('select[name="periodo"]');
const btnFil = document.querySelector(".btn-filtros");

async function filtrar() {
  const params = new URLSearchParams({
    busca: inBusca.value,
    periodo: selPer.value,
    arquivadas: tbody.dataset.arquivadas,
  });

  const resp = await fetch("/consultas/filtrar?" + params);
  tbody.innerHTML = await resp.text();
}


let timer;
inBusca.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(filtrar, 300);
});

selPer.addEventListener("change", filtrar);
btnFil.addEventListener("click", filtrar);
