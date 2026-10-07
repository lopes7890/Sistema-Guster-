import Paciente from "../models/Paciente.js";
import TelefonesPaciente from "../models/TelefonesPaciente.js";
import Medico from "../models/Medico.js";
import Exame from "../models/Exame.js";
import Aparelho from "../models/Aparelho.js";
import Sintoma from "../models/Sintoma.js";
import PacienteSintoma from "../models/PacienteSintoma.js";
import Processamento from "../models/Processamento.js";
import Relatorio from "../models/Relatorio.js";

const defineAssociations = () => {
  Medico.hasMany(Exame, {
    foreignKey: "id_medico",
  });

  Exame.belongsTo(Medico, {
    foregnKey: "id_medico",
  });

  Aparelho.hasMany(Exame, {
    foregnKey: "id_aparelho",
  });

  Exame.belongsTo(Aparelho, {
    foreignKey: "id_aparelho",
  });

  Paciente.hasMany(Exame, {
    foreignKey: "id_paciente",
  });

  Exame.belongsTo(Paciente, {
    foreignKey: "id_paciente",
  });

  Paciente.belongsToMany(Sintoma, {
    through: PacienteSintoma,
    foreignKey: "id_paciente",
    otherKey: "id_sintoma",
  });

  Sintoma.belongsToMany(Paciente, {
    through: PacienteSintoma,
    foreignKey: "id_sintoma",
    otherKey: "id_paciente",
  });

  Exame.hasMany(Processamento, {
    foreignKey: "id_exame",
  });

  Processamento.belongsTo(Exame, {
    foreingKey: "id_exame",
  });

  Paciente.hasMany(TelefonesPaciente, {
    foreignKey: "id_paciente",
  });

  TelefonesPaciente.belongsTo(Paciente, {
    foreignKey: "id_paciente",
  });

  Processamento.hasMany(Relatorio, {
    foreignKey: "id_processamento",
  });

  Relatorio.belongsTo(Processamento, {
    foreignKey: "id_processamento",
  });
};

export default defineAssociations;
