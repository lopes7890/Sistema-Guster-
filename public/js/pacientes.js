
const gridPacientes = document.querySelector(".grid-pacientes");
const inBusca = document.querySelector('input[name="busca"]');
const selPeriodo = document.querySelector('select[name="periodo"]');
const containerPacientes = document.querySelector(".pacientes-lista");

if (gridPacientes && inBusca && selPeriodo && containerPacientes) {
    async function filtrarPacientes() {
        const params = new URLSearchParams({
            busca: inBusca.value.trim(),
            periodo: selPeriodo.value,
            arquivados: containerPacientes.dataset.arquivados,
            diagnostico:
                new URLSearchParams(window.location.search)
                    .get("diagnostico") || "todos"
        });

        try {
            gridPacientes.setAttribute("aria-busy", "true");

            const resp = await fetch(
                `/pacientes/filtrar?${params.toString()}`
            );

            if (!resp.ok) {
                throw new Error("Erro ao filtrar pacientes.");
            }

            const html = await resp.text();

            // Atualiza os cards e a mensagem de lista vazia
            gridPacientes.innerHTML = html;
        } catch (erro) {
            console.error("Erro ao filtrar pacientes:", erro);
        } finally {
            gridPacientes.removeAttribute("aria-busy");
        }
    }

    let timer;

    inBusca.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(filtrarPacientes, 300);
    });

    selPeriodo.addEventListener("change", filtrarPacientes);
}
