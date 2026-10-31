import express from "express";
import Sequelize, { where } from "sequelize";
import PDFDocument from "pdfkit";
import path from "node:path";
import { fileURLToPath } from "node:url";

import connection from "../config/config.js";
import upload from "../config/multer.js";

import autenticado from "../middlewares/autenticado.js";
import carregarMedico from "../middlewares/carregarMedico.js";
import tratarErroUpload from "../middlewares/tratarErroUpload.js";

import validarCPF from "../utils/validarCPF.js";
import formatarData from "../utils/formatarData.js";
import uploadFoto from "../utils/uploadFoto.js";
import gerarPDFBuffer from "../utils/gerarPDFBuffer.js";

import enviarPDFCloudinary  from "../services/cloudinaryServices.js";

import Paciente from "../models/Paciente.js";
import TelefonesPaciente from "../models/TelefonesPaciente.js";
import Sintoma from "../models/Sintoma.js";
import PacienteSintoma from "../models/PacienteSintoma.js";
import Exame from "../models/Exame.js";
import Dispositivo from "../models/Dispositivo.js";
import Processamento from "../models/Processamento.js";
import Medico from "../models/Medico.js";
import Relatorio from "../models/Relatorio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/consulta/nova", autenticado, carregarMedico, (req, res) => {
  return res.render("novaConsulta", {
    mostrarNovaConsulta: false,
    subtitulo: "Nova Consulta",
    messages: req.flash()
  });
});

router.get("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
  const { id_paciente } = req.query;
  return res.render("informacoesConsulta", {
    mostrarNovaConsulta: false,
    id_paciente: id_paciente,
    subtitulo: "Nova Consulta",
  });
});

router.get("/consulta/conexaoBCI", autenticado, carregarMedico, (req, res) => {
  const { id_paciente } = req.query;
  return res.render("conexaoBCI", {
    mostrarNovaConsulta: false,
    id_paciente: id_paciente,
    subtitulo: "Nova Consulta",
    messages: req.flash()
  });
});

router.get("/consulta/exameBCI/:id_paciente", autenticado, carregarMedico, (req, res) => {
    return res.render("exameBCI", {
      mostrarNovaConsulta: false,
      id_paciente: req.params.id_paciente,
      subtitulo: "Nova Consulta",
    });
  },
);

// ROTAS DE SIMULAÇÃO DE RESULTADOS DO EXAME
router.get("/resultados/:id_paciente", autenticado, carregarMedico, (req, res) => {
    const id_paciente = req.params.id_paciente;

    // Buscar/Criar um dispositivo fictício
    Dispositivo.findOne({
        where: {
            nome: "teste"
        }
    })
    .then((dispositivo) => {

        if (!dispositivo) {
            return Dispositivo.create({
                nome: "teste",
                status_dispositivo: "Disponível"
            });
        }

        return dispositivo;
    })
    .then((dispositivo) => {

        return Exame.create({
            data_realizacao: new Date(),
            id_dispositivo: dispositivo.id,
            id_paciente: id_paciente,
            id_medico: req.medico.id
        });
    })
    .then((exame) => {

        return Processamento.create({
            resultado: "Hipogeusia",
            descricao: `O paciente apresenta indícios de hipogeusia, condição caracterizada pela redução da capacidade de perceber os sabores. Durante a avaliação, foram relatadas alterações na percepção gustativa, possivelmente associadas às sequelas da infecção por COVID-19.
                  Os resultados preliminares da análise dos sinais cerebrais captados pela interface cérebro-computador (BCI), em conjunto com as informações clínicas e os sintomas relatados, sugerem uma possível diminuição da sensibilidade gustativa.
                  Recomenda-se a realização de uma avaliação clínica especializada e de testes gustativos padronizados para confirmar a presença e determinar o grau da alteração.
                  Este resultado possui caráter preliminar e não constitui um diagnóstico médico definitivo.`,
            percentual_doce: 0.25,
            percentual_amargo: 0.3,
            probabilidade: 0.99,
            id_exame: exame.id
        });
    })
    .then((processamento) => {
        req.flash('success', 'Resultados gerados com sucesso!')
        return res.redirect(`/consulta/resultado?id_processamento=${processamento.id}`);
    })
    .catch((error) => {
        console.error("Falha ao simular os resultados do exame:", error);
        req.flash('danger', 'Falha ao simular os resultados do exame.');
        return res.redirect(`/resultados/${id_paciente}`);
    });
});

router.get("/consulta/resultado", autenticado, carregarMedico, (req, res) => {
  const { id_processamento } = req.query;

  if (!id_processamento || !Number.isInteger(Number(id_processamento))) {
    return res.status(400).send("ID do processamento inválido!");
  }

  Processamento.findOne({
    where: {
      id: id_processamento,
    },
    include: [
      {
        model: Exame,
        as: "Exame",
        required: true,
        where: {
          id_medico: req.medico.id,
        },
        attributes: ["id", "data_realizacao"],
        include: [
          {
            model: Paciente,
            as: "Paciente",
            attributes: ["id", "nome"],
          },
          {
            model: Medico,
            as: "Medico",
            attributes: ["id", "nome"],
          },
        ],
      },
    ],
  })
    .then((resultado) => {
      if (!resultado) {
        return res.status(404).send("Resultado não encontrado!");
      }

      const dados = resultado.toJSON();
      const exameAssociado = dados.Exame;
      const dataFormatada = formatarData(exameAssociado.data_realizacao);

      const exameResultado = {
        id: dados.id,
        id_exame: exameAssociado.id,

        paciente: exameAssociado.Paciente.nome,
        medico: exameAssociado.Medico.nome,
        data: dataFormatada,

        diagnostico: dados.resultado,
        descricao: dados.descricao,
        probabilidade: dados.probabilidade,
        sabores: [
          {
            nome: "Doce",
            cor: "doce",
            intensidade: Number(dados.percentual_doce) * 100,
          },
          {
            nome: "Amargo",
            cor: "amargo",
            intensidade: Number(dados.percentual_amargo) * 100,
          },
        ],

        padrao: 50,

        nivel: dados.resultado.toLowerCase(),
      };

      return res.render("resultados", {
        exame: exameResultado,
        mostrarNovaConsulta: false,
        subtitulo: "Resultado do Exame",
        messages: req.flash()
      });
    })
    .catch((error) => {
      console.error("Erro ao consultar resultado:", error);
      return res.status(500).send("Erro ao carregar o resultado!");
    });
});

// ==================================================================

router.get("/resultados/:id_processamento/relatorio", autenticado, carregarMedico, (req, res) => {
    const { id_processamento } = req.params;

    if (!/^[1-9]\d*$/.test(id_processamento) || !Number.isSafeInteger(Number(id_processamento))) {
      return res.status(400).send("ID do processamento inválido!");
    }  

    return Processamento.findOne({
      where: {
        id: Number(id_processamento),
      },
      include: [
        {
          model: Exame,
          as: "Exame",
          required: true,
          where: {
            id_medico: req.medico.id,
          },
          attributes: ["id", "data_realizacao"],
          include: [
            {
              model: Paciente,
              as: "Paciente",
              attributes: ["id", "nome"],
              include: [
                {
                  model: Sintoma,
                  as: "Sintomas",
                  attributes: ["id", "data_cov", "escala_0_10", "diferenca_no_paladar", "alteracao_comecou", "situacao_alteracao_atual", "alteracao_olfato", "observacao_paladar"],
                  through: {
                    attributes: ["id_sintoma"]
                  }
                }
              ]
            },
            {
              model: Medico,
              as: "Medico",
              attributes: ["id", "nome"],
            },
          ],
        },
      ],
    })
      .then((resultado) => {
        if (!resultado) {
          return res.status(404).send("Resultado não encontrado!");
        }

        const dados = resultado.toJSON();
        const exameAssociado = dados.Exame;

        if (!exameAssociado.Paciente || !exameAssociado.Medico) {
          return res.status(500).send("Dados do exame incompletos.");
        }

        const exameResultado = {
          id: dados.id,
          id_exame: exameAssociado.id,
          paciente: exameAssociado.Paciente.nome,
          medico: exameAssociado.Medico.nome,
          data: formatarData(exameAssociado.data_realizacao),
          diagnostico: dados.resultado,
          descricao: dados.descricao,
          probabilidade: dados.probabilidade,
          sabores: [
            {
              nome: "Doce",
              intensidade: Number(dados.percentual_doce) * 100,
            },
            {
              nome: "Amargo",
              intensidade: Number(dados.percentual_amargo) * 100,
            },
          ],
          data_covid: exameAssociado.Paciente.Sintomas[0].data_cov,
          escala_0_a_10: exameAssociado.Paciente.Sintomas[0].escala_0_10,
          diferenca_no_paladar: exameAssociado.Paciente.Sintomas[0].diferenca_no_paladar,
          alteracao_comecou: exameAssociado.Paciente.Sintomas[0].alteracao_comecou,
          situacao_alteracao_atual: exameAssociado.Paciente.Sintomas[0].situacao_alteracao_atual,
          alteracao_olfato: exameAssociado.Paciente.Sintomas[0].alteracao_olfato,
          observacao_paladar: exameAssociado.Paciente.Sintomas[0].observacao_paladar
        };

        const caminhoLogo = path.resolve(__dirname,"../assets/logo-specius.png");

        const nomeArquivo = `relatorio-exame-${exameResultado.id}.pdf`;

        const publicId = `relatorio-exame-${exameResultado.id}`;

        return Relatorio.findOne({
          where: {
            id_processamento: dados.id,
          },
        })
        .then((relatorioAntigo) => {
          return gerarPDFBuffer(exameResultado, caminhoLogo)
            .then((buffer) => {
                return enviarPDFCloudinary(buffer, publicId)
                    .then((arquivo) => ({
                        buffer,
                        arquivo,
                        relatorioAntigo,
                    }));
            });
        })
        .then(({ buffer, arquivo, relatorioAntigo }) => {
          const excluirAntigo = relatorioAntigo
            ? relatorioAntigo.destroy()
            : Promise.resolve();

          return excluirAntigo.then(() => {
            return Relatorio.create({
                data_realizado: new Date(),
                id_processamento: dados.id,
                pdf_url: arquivo.url,
                pdf_public_id: arquivo.publicId,
            }).then(() => buffer);
          });
      })
      .then((buffer) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${nomeArquivo}"`
        );

        return res.send(buffer);
      })
      .catch((error) => {
        console.error("Erro ao gerar relatório PDF:", error);

        if (res.headersSent) {
            if (!res.writableEnded) {
                res.destroy(error);
            }

            return;
        }

        return res.status(500).send(
            "Erro ao gerar ou armazenar o relatório PDF."
        );
      });
      })
      .catch((error) => {
        console.error("Erro ao gerar relatório PDF:", error);

        if (res.headersSent) {
          if (!res.writableEnded) {
            res.destroy(error);
          }

          return;
        }

        return res.status(500).send("Erro ao gerar o relatório PDF.");
      });
  },
);

router.post("/consulta/informacoes", autenticado, carregarMedico, (req, res) => {
    const {dataCovid, capacidadeSabor, diferencaPaladar, inicioAlteracao, persistenciaAlteracao, alteracaoOlfato, observacoesPaladar, id_paciente,} = req.body;
    if (!dataCovid || !capacidadeSabor || !diferencaPaladar || !inicioAlteracao || !persistenciaAlteracao || !alteracaoOlfato || !id_paciente) {
      return res.status(400).send("Preencha todos os campos!");
    }

    if(dataCovid.split('-')[0] < 2019){
      return res.status(400).send("Data inválida!");
    }

    Sintoma.create({
      data_cov: dataCovid,
      escala_0_10: Number(capacidadeSabor),
      diferenca_no_paladar: diferencaPaladar,
      alteracao_comecou: inicioAlteracao,
      situacao_alteracao_atual: persistenciaAlteracao,
      alteracao_olfato: alteracaoOlfato,
      observacao_paladar: observacoesPaladar ? observacoesPaladar : null
    }).then((sintoma) => {
      PacienteSintoma.create({
        id_paciente: id_paciente,
        id_sintoma: sintoma.id,
      })
        .then(() => {
          return res.redirect(`/consulta/conexaoBCI?id_paciente=${id_paciente}`,);
        })
        .catch((error) => {
          console.log(`Falha ao cadastrar os sintomas ${error}`);
          return res.status(500).send(`Falha ao cadastrar os sintomas ${error}`);
        });
    });
  },
);

router.post("/pacientes/novo", autenticado, carregarMedico, tratarErroUpload(upload.single("foto"), (req) => '/consulta/nova'), (req, res) => {
    const { nome, nascimento, telefone, cpf, endereco, cep, email } = req.body;

    if (!nome || !nascimento || !telefone || !cpf || !endereco || !cep || !email) {
      req.flash('danger', 'Preencha todos os campos!');
      return res.redirect("/consulta/nova");
    }

    if(Number(nascimento.split("-")[0]) >= new Date().getFullYear()){
      req.flash('danger', 'Data incorreta! Forneça uma data válida.');
      return res.redirect("/consulta/nova");;
    }

    if (!validarCPF(cpf)) {
      req.flash('danger', 'CPF inválido! Forneça um CPF válido.');
      return res.redirect("/consulta/nova");
    }

    const emailNormalizado = email.trim().toLowerCase();
    const cpfNormalizado = cpf.trim();

    Paciente.findOne({
      where: {
        [Sequelize.Op.or]: [
          { cpf: cpfNormalizado },
          { email: emailNormalizado },
        ],
      },
    })
      .then((pacienteExistente) => {
        if (pacienteExistente) {
          return PacienteSintoma.findOne({
            where: {
              id_paciente: pacienteExistente.id,
            },
          }).then((pacienteComSintoma) => {
            if (pacienteComSintoma) {
              return Exame.findOne({
                where: {
                  id_paciente: pacienteComSintoma.id_paciente,
                },
              }).then((pacienteExame) => {
                if (pacienteExame) {
                  return Processamento.findOne({
                    where: {
                      id_exame: pacienteExame.id,
                    },
                  }).then((exameConcluido) => {
                    if (exameConcluido) {
                      req.flash('danger', 'Este paciente já possui um prontuário!');
                      return res.redirect(`/consulta/nova`);
                    }
                  });
                }
                req.flash('success', 'Este paciente já possui um cadastro, mas não tem um prontuário!')
                return res.redirect(`/consulta/conexaoBCI?id_paciente=${pacienteComSintoma.id_paciente}`);
              });
            }
            
            return res.redirect(`/consulta/informacoes?id_paciente=${pacienteExistente.id}`);
          });
        }

        const promessaFoto = req.file
          ? uploadFoto(req.file)
          : Promise.resolve(null);

        return promessaFoto.then((foto) => {
          return Paciente.create({
            nome: nome,
            email: emailNormalizado,
            cpf: cpfNormalizado,
            data_nasc: nascimento,
            endereco: endereco,
            cep: cep,
            foto: foto ? foto.url : null,
          }).then((paciente) => {
            return TelefonesPaciente.create({
              id_paciente: paciente.id,
              telefone,
            }).then(() => {
              return res.redirect(`/consulta/informacoes?id_paciente=${paciente.id}`);
            });
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao cadastrar paciente:", error);

        if (res.headersSent) {
          return;
        }
        req.flash('danger', 'Falha ao processar o paciente. Tente novamente!');
        return res.redirect("/consulta/nova");
      });
  },
);

export default router;
