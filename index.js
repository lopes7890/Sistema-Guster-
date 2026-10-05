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






const port = 8080;
app.listen(port, function(erro){
    if(erro){
        console.log(`Ocorreu um erro! Erro: ${erro}`);
    } else {
        console.log(`Servidor rodando na porta ${port}`);
    }
});