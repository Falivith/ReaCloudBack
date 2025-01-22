const Recurso = require("../models/recurso");
const Like = require("../models/like");
const fs = require("fs");
const { checkToken, verifyUser } = require("../controllers/authentication");
const recursoRouter = require("express").Router();
const { upload, resizeImage } = require("../controllers/reaPictureMulter");
const { Op: operators, fn, col } = require("sequelize");
const {sendIssueNotification} = require("../controllers/sendIssueNotification");

// Consultar (filtrar) dentre todos os recursos
recursoRouter.get("/filter", async (req, res) => {
  let {
    title,
    knowledge_area,
    rea_type,
    currentPage = 1,
    pageSize = 10,
  } = req.query;

  // Parse currentPage and pageSize as integers
  currentPage = parseInt(currentPage, 10);
  pageSize = parseInt(pageSize, 10);

  const filters = {};

  if (title) {
    filters.title = { [operators.like]: `%${title}%` };
  }
  if (knowledge_area) {
    filters.knowledgeArea = knowledge_area;
  }
  if (rea_type) {
    filters.reaType = rea_type;
  }

  const offset = (currentPage - 1) * pageSize;

  try {
    // Get the total count of items matching the filters
    const totalItems = await Recurso.count({ where: filters });

    // Get the filtered items with pagination
    const recursos = await Recurso.findAll({
      where: filters,
      offset: offset,
      limit: pageSize,
    });

    // Map recurso IDs to get the like counts
    const recursoIds = recursos.map((recurso) => recurso.id);

    // Get the like counts for each recurso
    const likeCounts = await Like.findAll({
      attributes: ["recurso_id", [fn("COUNT", col("id")), "numLikes"]],
      where: { recurso_id: recursoIds },
      group: ["recurso_id"],
    });

    // Create a map of recurso_id to numLikes
    const likeCountsMap = likeCounts.reduce((acc, like) => {
      acc[like.recurso_id] = like.dataValues.numLikes;
      return acc;
    }, {});

    // Add numLikes to each recurso
    const recursosWithLikes = recursos.map((recurso) => {
      return {
        ...recurso.dataValues,
        numLikes: likeCountsMap[recurso.id] || 0,
      };
    });

    // Calculate the total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      recursos: recursosWithLikes,
      currentPage: currentPage,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro com a filtragem dos recursos." });
  }
});

// Consultar todos os recursos (só usar em testes)
recursoRouter.get("/", async (req, res) => {
  const reas = await Recurso.findAll({
    logging: false,
  });
  res.status(201).json(reas);
});

// Consultar os recursos de um usuário
recursoRouter.get("/user", verifyUser, async (req, res) => {
  const user = req.user;

  const userId = user.id;

  try {
    const reas = await Recurso.findAll({
      where: { user_id: userId },
      logging: false,
    });

    if (!reas.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(reas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro na consulta de recursos." });
  }
});

// Postar um recurso
recursoRouter.post("/", verifyUser, upload, resizeImage, async (req, res) => {
  const decodedToken = await checkToken(req);

  if (req.body && req.file) {
    const imagePath = req.file.path;

    try {
      const recurso = await Recurso.create({
        ...req.body,
        user_id: decodedToken.id,
        thumb: imagePath,
      });

      if (recurso) {
        console.log("Recurso cadastrado com sucesso.");
        return res.status(201).json(recurso);
      } else {
        // com esse fs.unlink ele deleta a imagem se der erro
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Erro ao deletar o arquivo temporário", err);
          }
        });
        console.log("Falha ao cadastrar recurso. (Database access failed)");
        return res
          .status(400)
          .json({
            error: "Falha ao cadastrar recurso. (Database access failed)",
          });
      }
    } catch (error) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Erro ao deletar o arquivo temporário", err);
        }
      });
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar o recurso." });
    }
  } else {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Erro ao deletar o arquivo temporário", err);
        }
      });
    }
    return res.status(400).json({ error: "Falha ao cadastrar o recurso." });
  }
});

// Consultar os detalhes de um recurso
recursoRouter.get("/:id", async (req, res) => {
  const resourceId = req.params.id;

  try {
    const recurso = await Recurso.findOne({
      where: { id: resourceId },
      logging: false, // Disable the Log of the query
    });

    if (!recurso) {
      return res
        .status(404)
        .json({ error: "O recurso com esse ID não foi encontrado." });
    }

    return res.status(200).json(recurso);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao encontrar o recurso." });
  }
});

// Deletar um recurso
recursoRouter.delete("/:id", verifyUser, async (req, res) => {
  try {
    // Validar o usuário
    const resourceId = req.params.id;
    const user = req.user;
    const userId = user.id;

    const recurso = await Recurso.findOne({
      where: { id: resourceId, user_id: userId }, // Adicione a condição para verificar o user_id
      logging: false,
    });

    if (!recurso) {
      return res
        .status(404)
        .json({ error: "O recurso com esse ID não foi encontrado." });
    }

    const thumbPath = recurso.thumb; //tem que ser antes do destroy!!

    await recurso.destroy();

    // Para deletar a thumb
    if (thumbPath) {
      fs.unlink(thumbPath, (err) => {
        if (err) {
          console.error("Erro ao deletar o thumbnail:", err);
        } else {
          console.log("Thumbnail deletado com sucesso:", thumbPath);
        }
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao encontrar o recurso." });
  }
});

//Num de likes de um recurso
recursoRouter.get("/:recursoId/liked", verifyUser, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;

    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        recurso_id: req.params.recursoId,
      },
    });

    if (existingLike) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao consultar a avaliação." });
  }
});

// Adicionar ou remover um like de um recurso para um usuário
recursoRouter.post("/:recursoId/like", verifyUser, async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;

    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        recurso_id: req.params.recursoId,
      },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(204).json({ message: "Like removido com sucesso." });
    } else {
      await Like.create({
        user_id: userId,
        recurso_id: req.params.recursoId,
      });
      return res.status(201).json({ message: "Like adicionado com sucesso." });
    }
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      console.log("Usuario Não Logado");
      return res.status(401).json({ error: "Usuário não autenticado. Por favor, faça login novamente."});
    }
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar a solicitação de Like." });
  }
});

// Contar os likes para um recurso específico
recursoRouter.get("/:recursoId/likes/count", async (req, res) => {
  try {
    const likeCount = await Like.count({
      where: {
        recurso_id: req.params.recursoId,
      },
    });

    return res.status(200).json({ likeCount });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao obter a contagem de likes." });
  }
});

// reportar um problema com um recurso
recursoRouter.post("/:recursoId/report", verifyUser, async (req, res) => {
  try {
    const recurso_id = req.params.recursoId;
    const description = req.body.issue;
    const user = req.user;
    const user_id = user.id;

    const recurso = await Recurso.findOne({
      where: { id: recurso_id},
      logging: false,
    });

    if (!recurso) {
      return res
        .status(404)
        .json({ error: "O recurso com esse ID não foi encontrado." });
    }

    const newIssue = await recurso.createIssue({
      recurso_id,
      user_id,
      description
    });

    // Send email notification
    await sendIssueNotification(newIssue, recurso, user);

    return res.status(201).json({
      message: "Problema reportado com sucesso"
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao enviar o problema." });
  }  
});

// editar um recurso
recursoRouter.put("/:id", verifyUser, upload, resizeImage, async (req, res) => {
  const decodedToken = await checkToken(req);
  const recursoId = req.params.id;

  try {
    // Find existing resource
    const existingResource = await Recurso.findOne({
      where: { 
        id: recursoId,
        user_id: decodedToken.id 
      }
    });

    if (!existingResource) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao deletar arquivo temporário", err);
        });
      }
      return res.status(404).json({ error: "Recurso não encontrado ou não autorizado" });
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle image update if provided
    if (req.file) {
      // Delete old image
      if (existingResource.thumb) {
        fs.unlink(existingResource.thumb, (err) => {
          if (err) console.error("Erro ao deletar imagem antiga", err);
        });
      }
      updateData.thumb = req.file.path;
    }

    // Update resource
    const [updated] = await Recurso.update(updateData, {
      where: { 
        id: recursoId,
        user_id: decodedToken.id 
      }
    });

    if (updated) {
      const updatedResource = await Recurso.findByPk(recursoId);
      return res.status(200).json(updatedResource);
    } else {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao deletar arquivo temporário", err);
        });
      }
      return res.status(400).json({ error: "Falha ao atualizar recurso" });
    }

  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Erro ao deletar arquivo temporário", err);
      });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o recurso" });
  }
});

module.exports = recursoRouter;
