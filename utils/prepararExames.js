import calcularIdade from "../utils/calcularIdade.js";
import formatarData from "../utils/formatarData.js";

function prepararExames(exames) {
    return exames.map((exame) => {
        const dados = exame.toJSON();

        if (dados.Paciente?.data_nasc) {
            dados.Paciente.idade = calcularIdade(dados.Paciente.data_nasc);
        }

        if (dados.data_realizacao) {
            dados.data_realizacao = formatarData(dados.data_realizacao);
        }

        return dados;
    });
}
export default prepararExames;