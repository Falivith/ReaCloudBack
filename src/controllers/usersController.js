const fs = require("fs");
const util = require("./authentication");
const User = require("../models/user");

exports.uploadProfilePicture = async (req, res) => {
  console.log("Recebendo arquivo");
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({
          error:
            "Formato de arquivo inválido. Apenas JPEG e PNG são permitidos.",
        });
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json({ error: "O tamanho do arquivo excede o limite de 2 MB." });
    }

    const decodedToken = await util.checkToken(req);
    if (!decodedToken) {
      return res.status(401).json({ error: "Usuário não autorizado." });
    }

    let imageFile;
    try {
      imageFile = fs.readFileSync(req.file.path);
    } catch (err) {
      console.error("Erro ao ler o arquivo:", err);
      return res
        .status(500)
        .json({ error: "Erro ao processar o arquivo enviado." });
    }

    const buffer = Buffer.from(imageFile);

    const user = await User.findOne({ where: { email: decodedToken.email } });

    if (!user) {
      console.log("Usuário não encontrado.");
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    let updatedUser;
    try {
      updatedUser = await user.update(
        { profilePicture: buffer },
        { returning: true }
      );
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar o perfil do usuário." });
    }

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Erro ao deletar o arquivo temporário." });
      }
    });

    // Send the response separately to ensure file deletion errors don't block it
    res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno de API." });
  }
};
