import express from "express";
import connection from "./config/config.js";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.static('public'));

connection.authenticate().then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch((error) => {
    console.log(`Falha ao se conectar com o banco de dados: ${error}`);
})

const DB_NAME = 'Guster'
connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`).then(() => {
    console.log("Banco de dados criado com sucesso!");
}).catch((error) => {
    console.log(`Erro ao criar o banco de dados. Erro ${error}`);
});

Promise.all([
    Medico.sync({force: false}),
    Paciente.sync({force: false}),
    Sintoma.sync({force: false}),
    Aparelho.sync({force: false}),
    TelefonesPaciente.sync({force: false}),
    Exame.sync({force: false}),
    PacienteSintoma.sync({force: false}),
    Processamento.sync({force: false}),
    Relatorio.sync({force: false})
]);


import Medico from "./models/Medico.js";
import Aparelho from "./models/Aparelho.js";
import Paciente from "./models/Paciente.js";
import Sintoma from "./models/Sintoma.js";
import TelefonesPaciente from "./models/TelefonesPaciente.js";
import Exame from "./models/Exame.js";
import PacienteSintoma from "./models/PacienteSintoma.js";
import Processamento from "./models/Processamento.js";
import Relatorio from "./models/Relatorio.js";
import defineAssociations from "./config/associations.js"

defineAssociations();

const port = 8080;
app.listen(port, function(erro){
    if(erro){
        console.log(`Ocorreu um erro! Erro: ${erro}`);
    } else {
        console.log(`Servidor rodando na porta ${port}`);
    }
});