const User = require('../models/user');
const util = require('../controllers/authentication');
const usersRouter = require('express').Router()
const { upload, resizeImage } = require('../controllers/userPictureMulter')
const usersController = require('../controllers/usersController');

// Upload de foto de perfil
usersRouter.post('/uploadPhoto', upload.single('file'), resizeImage, usersController.uploadProfilePicture);

// Consulta de foto de perfil
usersRouter.get('/uploadPhoto', async (req, res) => {
  try {
    const decodedToken = await util.checkToken(req)

    if (!decodedToken) {
      return res.status(401).json({ error: "Usuário não autorizado." }); 
    }

    const user = await User.findByPk(decodedToken.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

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

// Consulta de todos os usuários
// usersRouter.get('/', async (req, res) => {
//   const user = await User.findAll();
//   res.status(201).json(user);
// });

// Cadastro de usuário
// usersRouter.post('/', async (req, res) => {

//   if (req.body.email.length < 5) {
//     return res.status(400).json({ error: 'Invalid email!' });
//   }

//   const saltRounds = 10

//   const existingUser = await User.findOne({ where: { email: req.body.email } });
//   if (existingUser) {
//     return res.status(400).json({ error: 'User already exists' });
//   }

//   const passwordHashed = await bcrypt.hash(req.body.password, saltRounds)
//   const user = await User.create({ ...req.body, password: passwordHashed })
//   res.status(201).json(user)
// })

// Alteração de senha
// usersRouter.put('/dados', async (req, res) => {
//   const decodedToken = await util.checkToken(req)
//   const { password, newPassword } = req.body
//   const user = await User.findByPk(decodedToken.id);
//   const passwordCorrect = user === null
//     ? false
//     : await bcrypt.compare(password, user.password)

//   if (!(user && passwordCorrect)) {
//     return res.status(401).json({
//       error: 'invalid username or password'
//     })
//   }
//   else {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     res.send('Password updated successfully');
//   }
// })

// Consulta de dados da conta
usersRouter.get('/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ where: { email } }); // Find user by email
    if (user) {
      res.status(200).json(user);
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
    res.status(200).json({ given_name, profilePicture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Alteração de dados da conta 
usersRouter.put('/:email', async (req, res) => {
  try {
    const decodedToken = await util.checkToken(req);

    const user = await User.findByPk(decodedToken.id);

    if (user) {
      const { profilePicture, ...data } = req.body;

      if (data.given_name.length === 0) {
        return res.status(400).json({ error: 'Nome não fornecido' });
      }

      const updatedUser = await user.update(data);
      res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = usersRouter