import PDFDocument from "pdfkit";
import formatarData from "./formatarData.js";

function gerarPDFBuffer(exameResultado, caminhoLogo_p) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
            },
            info: {
                Title: `Relatório do processamento ${exameResultado.id}`,
                Author: exameResultado.medico,
            },
        });

        const partes = [];

        doc.on("data", (parte) => {
            partes.push(parte);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(partes));
        });

        doc.on("error", reject);

        doc
            .fontSize(20)
            .fillColor("#0F5D8C")
            .text("RELATÓRIO DE RESULTADO DO EXAME", {
              align: "center",
            });

          doc.moveDown(0.5);

          doc
            .fontSize(10)
            .fillColor("#666666")
            .text("Sistema Guster | Relatório de processamento", {
              align: "center",
            });

          doc.moveDown(2);

          // Identificação
          doc.fontSize(14).fillColor("#0F5D8C").text("1. Identificação");

          doc.moveDown(0.5);

          doc.fontSize(11).fillColor("#222222");

          doc.text(`Paciente: ${exameResultado.paciente}`);
          doc.text(`Médico responsável: ${exameResultado.medico}`);
          doc.text(`Data de realização: ${exameResultado.data}`);

          doc.moveDown(1.5);


          // Relato do paciente
          doc.fontSize(14).fillColor("#0F5D8C").text("2. Sintomas do paciente");
          doc.moveDown(0.5);

          doc.fontSize(11).fillColor("#222222");

          doc.text(`1. Data da infecção por COVID-19: ${formatarData(exameResultado.data_covid) ?? "Não informado"}`);
          doc.moveDown(0.5);
          doc.text(`2. Como você percebe os gostos atualmente? (escala do 0 a 10): ${exameResultado.escala_0_a_10}`);
          doc.moveDown(0.5);
          doc.text(`3. Você percebeu alguma alteração no paladar durante ou após a COVID-19? ${exameResultado.diferenca_no_paladar}`);
          doc.moveDown(0.5);
          doc.text(`4. Quando a alteração começou? ${exameResultado.alteracao_comecou}`);
          doc.moveDown(0.5);
          doc.text(`5. Como está a alteração atualmente? ${exameResultado.situacao_alteracao_atual}`);
          doc.moveDown(0.5);
          doc.text(`6. Você também percebeu alterações no olfato? ${exameResultado.alteracao_olfato}`);
          doc.moveDown(0.5);
          doc.text(`7. Descreva outras alterações percebidas (opcional) ${exameResultado.observacao_paladar ?? "Não informado"}`);

          doc.moveDown(1.5);

          // Resultado
          doc.fontSize(14).fillColor("#0F5D8C").text("3. Resultado");

          doc.moveDown(0.5);

          doc
            .fontSize(12)
            .fillColor("#222222")
            .text(
              `Diagnóstico: ${exameResultado.diagnostico ?? "Não informado"}`,
            );

          doc.moveDown(0.5);

          doc.fontSize(11).text("Descrição:");

          doc
            .fontSize(10)
            .text(exameResultado.descricao ?? "Sem descrição disponível.", {
              align: "justify",
            });

          doc.moveDown(1.5);

          // Intensidade dos sabores
          doc
            .fontSize(14)
            .fillColor("#0F5D8C")
            .text("3. Intensidade dos sabores");

          doc.moveDown(0.5);

          exameResultado.sabores.forEach((sabor) => {
            const intensidade = Number.isFinite(sabor.intensidade)
              ? sabor.intensidade
              : 0;

            doc
              .fontSize(11)
              .fillColor("#222222")
              .text(`${sabor.nome}: ${intensidade.toFixed(2)}%`);

            const larguraMaxima = 400;
            const valorVisual = Math.max(0, Math.min(intensidade, 100));

            const y = doc.y + 5;

            doc.rect(50, y, larguraMaxima, 10).fillColor("#E5E7EB").fill();

            doc
              .rect(50, y, (larguraMaxima * valorVisual) / 100, 10)
              .fillColor("#0F5D8C")
              .fill();

            doc.y = y + 25;
          });

          doc.moveDown(1);

          // Rodapé
          doc
            .fontSize(9)
            .fillColor("#666666")
            .text(
                "Documento gerado pelo sistema a partir dos dados " +
                "registrados no processamento do exame.",
                50,
                doc.y,
                {
                  width: 495,
                  align: "center"
                }
            );

          
          const caminhoLogo = caminhoLogo_p

          const larguraLogo = 100;
          const alturaLogo = 40;

          const larguraPagina = doc.page.width;
          const alturaPagina = doc.page.height;

          const x = (larguraPagina - larguraLogo) / 2;
          const y = alturaPagina - alturaLogo - 35;

          doc.image(caminhoLogo, x, y, {
            fit: [larguraLogo, alturaLogo],
            align: "center",
            valign: "center"
          });

        doc.end();
    });
}

export default gerarPDFBuffer;