const User = require('../models/user');
const {verifyUser} = require('../controllers/authentication');
const usersRouter = require('express').Router()
const { upload, resizeImage } = require('../controllers/userPictureMulter')
const usersController = require('../controllers/usersController');


// Upload de foto de perfil
usersRouter.post('/uploadPhoto', verifyUser, upload.single('file'), resizeImage, usersController.uploadProfilePicture);

// Consulta de foto de perfil
usersRouter.get('/uploadPhoto', verifyUser, async (req, res) => {
  try {
    const user = req.user;

    if (user.profilePicture) {
      res.set('Content-Disposition', 'inline');
      return res.status(200).json({ data: user.profilePicture })
    } else {
      console.log('Foto não encontrada.');
      return res.status(200).json({ data: null });
    }
  } catch (err) {
    console.error('Erro no upload da foto:', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
})


// Consulta de dados da conta
usersRouter.get('/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ where: { email } }); // Find user by email
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao procurar usuário:', error);
    return res.status(500).json({ error: 'Erro ao procurar usuário.' });
  }
});

// Consulta nome e foto do usuário por ID
usersRouter.get('/:id/info', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retorna apenas o nome e a foto do usuário
    const { given_name, profilePicture } = user;
    return res.status(200).json({ given_name, profilePicture });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Alteração de dados da conta 
usersRouter.put('/:email', verifyUser,  async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      const { profilePicture, ...data } = req.body;

      if (data.given_name.length === 0) {
        return res.status(400).json({ error: 'Nome não fornecido' });
      }

      const updatedUser = await user.update(data);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = usersRouter