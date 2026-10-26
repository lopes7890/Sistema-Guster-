
const gridPacientes = document.querySelector(".grid-pacientes");
const inBusca = document.querySelector('input[name="busca"]');
const selPeriodo = document.querySelector('select[name="periodo"]');

if (gridPacientes && inBusca && selPeriodo) {
    async function filtrarPacientes() {
        const params = new URLSearchParams({
            busca: inBusca.value.trim(),
            periodo: selPeriodo.value,
            diagnostico: new URLSearchParams(
                window.location.search
            ).get("diagnostico") || "todos"
        });

        try {
            gridPacientes.setAttribute("aria-busy", "true");

            const resp = await fetch(
                `/pacientes/filtrar?${params.toString()}`
            );

            if (!resp.ok) {
                throw new Error("Erro ao filtrar pacientes.");
            }

            gridPacientes.innerHTML = await resp.text();
        } catch (erro) {
            console.error(erro);
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
