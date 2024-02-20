const bcrypt = require('bcryptjs');
const User = require('../models/user');
const util = require('../util/authentication');
const usersRouter = require('express').Router()
const multer = require('multer');
const fs = require('fs');

// Configuração do Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

// Upload de foto de perfil
usersRouter.post('/uploadPhoto', upload.single('file'), async (req, res) => {
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
});

// Consulta de foto de perfil
usersRouter.get('/uploadPhoto', async (req, res) => {
  const decodedToken = await util.checkToken(req)

  const user = await User.findByPk(decodedToken.id);

    if (user.profilePicture) {
      res.set('Content-Disposition', 'inline');
      res.json({data: user.profilePicture})
    } else {
      console.log('Foto não encontrada.');
      return res.status(200);
    } 
})

// Consulta de todos os usuários
usersRouter.get('/', async (req, res) => {
  const user = await User.findAll();
  res.status(201).json(user);
});

// Cadastro de usuário
usersRouter.post('/', async (req, res) => {

  if (req.body.email.length < 5) {
    return res.status(400).json({ error: 'Invalid email!' });
  }

  const saltRounds = 10
  
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const passwordHashed = await bcrypt.hash(req.body.password,saltRounds)
  const user = await User.create({...req.body, password:passwordHashed })
  res.status(201).json(user)
})

// Alteração de senha
usersRouter.put('/dados', async (req, res) => {
  const decodedToken = await util.checkToken(req)
  const {password,newPassword} = req.body
  const user = await User.findByPk(decodedToken.id);
  const passwordCorrect = user === null
  ? false
  : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }
  else{
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send('Password updated successfully');
  }
})

// Consulta de dados da conta
usersRouter.get('/:email', async (req, res) => {
  const decodedToken = await util.checkToken(req)
    
  const user = await User.findByPk(decodedToken.id);
  if (user) {
    res.status(200).json(user)
  } else {
    console.log('Usuário não encontrado.');
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  } 
})
  
// Alteração de dados da conta 
usersRouter.put('/:email', async (req, res) => {
  try {
    const decodedToken = await util.checkToken(req);

    const user = await User.findByPk(decodedToken.id);

    if (user) {
      const { profilePicture, ...data } = req.body;

      if (data.nome.length === 0) {
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