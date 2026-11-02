# 👅 Sistema Guster

> Projeto Integrador do 2º Semestre — **BCI (Interface Cérebro-Computador) aplicada ao pré-diagnóstico de Ageusia e Hipogeusia**.

![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 Sobre o projeto

O **Sistema Guster** é a aplicação web desenvolvida como Projeto Integrador (PI) do 2º semestre. Ele dá suporte a um fluxo de **pré-diagnóstico de distúrbios do paladar**:

- **Ageusia**: perda total da capacidade de sentir sabores.
- **Hipogeusia**: redução da sensibilidade gustativa.

A proposta usa uma **BCI (Brain-Computer Interface)** como fonte de dados para auxiliar na triagem inicial. O sistema web gerencia usuários, autenticação, registros e geração de relatórios.

> ⚠️ **Aviso:** este é um projeto acadêmico. Ele **não substitui** avaliação, diagnóstico ou acompanhamento realizado por um profissional de saúde.

---

## ✨ Funcionalidades

- Autenticação de usuários com senhas criptografadas (**bcrypt**) e sessões/tokens (**JWT** + cookies)
- Controle de acesso por **middlewares**
- Upload de arquivos/imagens com **Multer**, armazenados no **Cloudinary**
- Geração de **relatórios em PDF** (PDFKit)
- Interface renderizada no servidor com **EJS**
- Mensagens de feedback ao usuário (express-flash)
- Persistência em **MySQL** via **Sequelize** (ORM)
- Ambiente containerizado com **Docker** e **Docker Compose**

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework web | Express 5 |
| Views | EJS |
| Banco de dados | MySQL 8.4 |
| ORM | Sequelize 6 + mysql2 |
| Autenticação | bcrypt, jsonwebtoken, express-session, cookie-parser |
| Upload / mídia | Multer, Cloudinary |
| Relatórios | PDFKit |
| Infraestrutura | Docker, Docker Compose |
| Dev | Nodemon, dotenv |

---

## 📁 Estrutura do projeto

```
Sistema-Guster-/
├── assets/          # Recursos estáticos auxiliares
├── config/          # Configurações (banco de dados, Cloudinary etc.)
├── controllers/     # Lógica das rotas
├── middlewares/     # Autenticação, validações, upload
├── models/          # Modelos Sequelize
├── public/          # Arquivos públicos (CSS, JS, imagens)
├── services/        # Regras de negócio e integrações
├── utils/           # Funções utilitárias
├── views/           # Templates EJS
├── .env.exemple     # Modelo de variáveis de ambiente
├── compose.yaml     # Orquestração (app + MySQL)
├── Dockerfile       # Imagem da aplicação
├── index.js         # Ponto de entrada
└── package.json
```

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada) e npm
- [MySQL 8+](https://www.mysql.com/) — ou apenas o Docker, se preferir a opção 2
- Conta no [Cloudinary](https://cloudinary.com/) (para o upload de imagens)
- [Docker](https://www.docker.com/) e Docker Compose (opcional)

### 1. Clonar o repositório

```bash
git clone https://github.com/lopes7890/Sistema-Guster-.git
cd Sistema-Guster-
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.exemple .env
```

| Variável | Descrição |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Nome da conta no Cloudinary |
| `CLOUDINARY_API_KEY` | Chave de API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Segredo da API do Cloudinary |
| `JWT_SECRET` | Chave secreta usada para assinar os tokens JWT |
| `DB_USER` | Usuário do banco de dados |
| `DB_PASSWORD` | Senha do usuário do banco |
| `DB_NAME` | Nome do banco de dados |
| `DB_HOST` | Host do banco (`localhost` localmente; `db` no Docker) |
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL (usada pelo Docker Compose) |

> 🔒 **Nunca** faça commit do arquivo `.env`.

### Opção 1 — Execução local

```bash
npm install
npm start
```

O script `start` usa o **nodemon**, reiniciando o servidor a cada alteração no código.

### Opção 2 — Docker Compose (recomendado)

```bash
docker compose up --build
```

Serão criados dois containers:

| Serviço | Container | Descrição | Porta |
|---|---|---|---|
| `app` | `api-docker` | Aplicação Node.js | `8080` |
| `db` | `mysql-docker` | MySQL 8.4 com volume persistente (`dados_mysql`) | `3307` (apenas localhost) |

A aplicação só inicia depois que o banco passa no *healthcheck*.

Acesse: **http://localhost:8080**

Para parar:

```bash
docker compose down        # mantém os dados
docker compose down -v     # remove também o volume do banco
```

---

## 🧪 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia a aplicação com nodemon |

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça o commit: `git commit -m "feat: minha feature"`
4. Envie a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
