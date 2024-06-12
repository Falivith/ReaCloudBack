require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
require("express-async-errors");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

module.exports = { sequelize };

require("./src/models/associations");

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// Rotas
const usersRouter = require("./src/routes/usersRouter");
const authRouter = require("./src/routes/googleAuthRouter");
const recursoRouter = require("./src/routes/recursoRouter");
const commentRouter = require("./src/routes/commentsRouter");

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/recurso", recursoRouter);
app.use("/api/comments", commentRouter);
app.use('/uploads', express.static('uploads'));


// Lança o front
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handler middleware
const errorHandler = require("./src/controllers/errorHandler");
app.use(errorHandler);

// Start the server
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados feita com sucesso.');

    // Sincroniza todos modelos
    await sequelize.sync({ logging: false });
    console.log('Todos modelos foram sincronizados.');

    app.listen(PORT, () => {
      console.log(`Server rodando na porta: ${Number(PORT)}`);
    });
  } catch (error) {
    console.error('Conexão com o banco de dados falhou: ', error);
  }
};

start();

module.exports = { app };
