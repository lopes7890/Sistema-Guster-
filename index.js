import express from "express";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.static('public'));









const port = 8080;
app.listen(port, function(erro){
    if(erro){
        console.log(`Ocorreu um erro! Erro: ${erro}`);
    } else {
        console.log(`Servidor rodando na porta ${port}`);
    }
});