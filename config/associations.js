import Paciente from "../models/Paciente.js";
import TelefonesPaciente from "../models/TelefonesPaciente.js";
import Medico from "../models/Medico.js";
import Exame from "../models/Exame.js";
import Dispositivo from "../models/Dispositivo.js";
import Sintoma from "../models/Sintoma.js";
import PacienteSintoma from "../models/PacienteSintoma.js";
import Processamento from "../models/Processamento.js";
import Relatorio from "../models/Relatorio.js";

const defineAssociations = () => {
  Medico.hasMany(Exame, {
    foreignKey: "id_medico",
    as: "Exames",
  });

  Exame.belongsTo(Medico, {
    foreignKey: "id_medico",
    as: "Medico",
  });

  Dispositivo.hasMany(Exame, {
    foreignKey: "id_dispositivo",
    as: "Exames",
  });

  Exame.belongsTo(Dispositivo, {
    foreignKey: "id_dispositivo",
    as: "Dispositivo",
  });

  Paciente.hasMany(Exame, {
    foreignKey: "id_paciente",
    as: "Exames",
  });

  Exame.belongsTo(Paciente, {
    foreignKey: "id_paciente",
    as: "Paciente",
  });

  Paciente.belongsToMany(Sintoma, {
    through: PacienteSintoma,
    foreignKey: "id_paciente",
    otherKey: "id_sintoma",
    as: "Sintomas",
  });

  Sintoma.belongsToMany(Paciente, {
    through: PacienteSintoma,
    foreignKey: "id_sintoma",
    otherKey: "id_paciente",
    as: "Pacientes",
  });

  Exame.hasMany(Processamento, {
    foreignKey: "id_exame",
    as: "Processamentos",
  });

  Processamento.belongsTo(Exame, {
    foreignKey: "id_exame",
    as: "Exame",
  });

  Paciente.hasMany(TelefonesPaciente, {
    foreignKey: "id_paciente",
    as: "Telefones",
  });

  TelefonesPaciente.belongsTo(Paciente, {
    foreignKey: "id_paciente",
    as: "Paciente",
  });

  Processamento.hasMany(Relatorio, {
    foreignKey: "id_processamento",
    as: "Relatorios",
  });

  Relatorio.belongsTo(Processamento, {
    foreignKey: "id_processamento",
    as: "Processamento",
  });
};

export default defineAssociations;
