const fs = require('fs');
const util = require('./authentication');
const User = require('../models/user');

exports.uploadProfilePicture = async (req, res) => {
  console.log('Recebendo arquivo');
  try {
    const decodedToken = await util.checkToken(req);
    const imageFile = fs.readFileSync(req.file.path);
    const buffer = Buffer.from(imageFile);

    const user = await User.findOne({ where: { email: decodedToken.email } });

    if (!user) {
      console.log('Usuário não encontrado.');
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const updatedUser = await user.update({ profilePicture: buffer }, { returning: true });

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao deletar o arquivo temporário.' });
      }

      res.status(200).json(updatedUser);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno de API.' });
  }
};
