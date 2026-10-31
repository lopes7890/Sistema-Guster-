import express from "express";
import connection from "./config/config.js";
import cookieParser from "cookie-parser";
import path from "path";
import flash from "express-flash";
import session from "express-session";

const app = express();
app.use(cookieParser());

app.use(session({
    secret: "guster_secret_key",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use(express.static('public'));
app.set('view engine', 'ejs');

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

// Promise.all([
//     Medico.sync({force: false}),
//     Paciente.sync({force: false}),
//     Sintoma.sync({force: false}),
//     Dispositivo.sync({force: false}),
//     TelefonesPaciente.sync({force: false}),
//     Exame.sync({force: false}),
//     PacienteSintoma.sync({force: false}),
//     Processamento.sync({force: false}),
//     Relatorio.sync({force: false})
// ]);

await Medico.sync({ force: false });

await Paciente.sync({ force: false });

await Sintoma.sync({ force: false });

await Dispositivo.sync({ force: false });

await TelefonesPaciente.sync({ force: false });

await PacienteSintoma.sync({ force: false });

await Exame.sync({ force: false });

await Processamento.sync({ force: false });

await Relatorio.sync({ force: false });

import Medico from "./models/Medico.js";
import Dispositivo from "./models/Dispositivo.js";
import Paciente from "./models/Paciente.js";
import Sintoma from "./models/Sintoma.js";
import TelefonesPaciente from "./models/TelefonesPaciente.js";
import Exame from "./models/Exame.js";
import PacienteSintoma from "./models/PacienteSintoma.js";
import Processamento from "./models/Processamento.js";
import Relatorio from "./models/Relatorio.js";
import defineAssociations from "./config/associations.js"

import MedicoControllers from "./controllers/MedicoControllers.js";
import HomeControllers from "./controllers/HomeControllers.js";
import PacienteControllers from "./controllers/PacienteControllers.js";
import NovaConsultaControllers from "./controllers/NovaConsultaControllers.js";
import ConfiguracaoControllers from "./controllers/ConfiguracaoControllers.js";
import FiltrosControllers from "./controllers/FiltrosControllers.js";


defineAssociations();

app.use("/", FiltrosControllers);
app.use("/", MedicoControllers);
app.use("/", HomeControllers);
app.use("/", PacienteControllers);
app.use("/", NovaConsultaControllers);
app.use("/", ConfiguracaoControllers);

app.get("/cadastro", (req, res) => {
    res.render("cadastro", {
        messages: req.flash()
    });
});

app.get("/", (req, res) => {
    res.render("index", {
        messages: req.flash()
    });
});

const port = 8080;
app.listen(port, function(erro){
    if(erro){
        console.log(`Ocorreu um erro! Erro: ${erro}`);
    } else {
        console.log(`Servidor rodando na porta ${port}`);
    }
});