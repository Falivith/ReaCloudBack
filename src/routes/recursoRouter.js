const Recurso = require('../models/recurso');
const Like = require('../models/like');
const fs = require('fs');
const util = require('../controllers/authentication');
const recursoRouter = require('express').Router();
const reaReceiver = require('../controllers/reaPictureMulter')
const { Op: operators, fn, col } = require('sequelize');

// Consultar (filtrar) dentre todos os recursos 
recursoRouter.get('/filter', async (req, res) => {
    let { title, knowledge_area, rea_type, currentPage = 1, pageSize = 10 } = req.query;

    const filters = {};

    if (title) {
        filters.title = { [operators.iLike]: `%${title}%` };
    }
    if (knowledge_area) {
        filters.knowledgeArea = knowledge_area;
    }
    if (rea_type) {
        filters.reaType = rea_type;
    }

    const offset = (currentPage - 1) * pageSize;

    try {
        const recursos = await Recurso.findAll({
            where: filters,
            offset: offset,
            limit: pageSize,
            /*include: [{
                model: Like,
                attributes: [[fn('COUNT', col('id')), 'numLikes']],
                required: false // Mesmo que não contenham likes
            }],
            group: ['Recurso.id'] // Precisamos agrupar por Recurso.id para garantir que a contagem de likes seja correta*/
        });

        /*recursos.forEach(recurso => {
            console.log(`Recurso: ${recurso.id}, Likes: ${recurso.Likes ? recurso.Likes.numLikes : 0}`);
        });*/

        res.json(recursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro com a filtragem dos recursos.' });
    }
});

// Consultar todos os recursos (só usar em testes)
recursoRouter.get('/', async (req, res) => {
    const reas = await Recurso.findAll({
        logging: false
    }) 
    res.status(201).json(reas);
});

// Consultar os recursos de um usuário
recursoRouter.get('/user', async (req, res) => {
    const decodedToken = await util.checkToken(req)

    const userId = decodedToken.id;
    
    try {
        const reas = await Recurso.findAll({
            where: { user_id: userId },
            logging: false
        });

        if (!reas.length) {
            return res.status(200).json([]);
        }

        return res.status(200).json(reas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro na consulta de recursos.' });
    }
});


// Postar um recurso
recursoRouter.post('/', reaReceiver.single('thumb'), async (req, res) => {
    const decodedToken = await util.checkToken(req)

    if (req.body) {
        const imageFile = fs.readFileSync(req.file.path);
        const buffer = Buffer.from(imageFile);
        const recurso = await Recurso.create({ ...req.body, user_id: decodedToken.id });
        const recursoperatorsronto = await recurso.update({
            thumb: buffer
        }, { returning: true });

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao deletar o arquivo temporário' });
            }
        });

        if (recursoperatorsronto) {
            res.status(201).json(recursoperatorsronto);
            console.log("Recurso cadastrado com sucesso.");
        } else {
            res.status(400).json(recursoperatorsronto);
            console.log("Falha ao cadastrar recurso. (Database access failed)");
        }
    } else {
        res.status(400).json("Falha ao cadastrar o recurso. (Null form received)");
    }
});

// Consultar os detalhes de um recurso
recursoRouter.get('/:id', async (req, res) => {

    const resourceId = req.params.id;
    
    try {
        const recurso = await Recurso.findOne({
            where: { id: resourceId }, 
            logging: false // Disable the Log of the query
        });

        if (!recurso) {
            return res.status(404).json({ error: 'O recurso com esse ID não foi encontrado.' });
        }

        return res.status(200).json(recurso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao encontrar o recurso.' });
    }
});

// Deletar um recurso
recursoRouter.delete('/:id', async (req, res) => {
    try {
        // Validar o usuário
        const resourceId = req.params.id;
        const decodedToken = await util.checkToken(req)
        const userId = decodedToken.id;

        const recurso = await Recurso.findOne({
            where: { id: resourceId, user_id: userId }, // Adicione a condição para verificar o user_id
            logging: false
        });

        if (!recurso) {
            return res.status(404).json({ error: 'O recurso com esse ID não foi encontrado.' });
        }

        await recurso.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao encontrar o recurso.' });
    }
});

recursoRouter.get('/:recursoId/liked', async (req, res) => {
    try {
        const decodedToken = await util.checkToken(req);
        const userId = decodedToken.id;

        const existingLike = await Like.findOne({
            where: {
                user_id: userId,
                recurso_id: req.params.recursoId
            }
        });

        if (existingLike) {
            return res.status(200).json({ liked: true });
        } else {
            return res.status(200).json({ liked: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao consultar a avaliação.' });
    }
});

// Adicionar ou remover um like de um recurso para um usuário
recursoRouter.post('/:recursoId/like', async (req, res) => {
    try {
        const decodedToken = await util.checkToken(req);
        const userId = decodedToken.id;

        const existingLike = await Like.findOne({
            where: {
                user_id: userId,
                recurso_id: req.params.recursoId
            }
        });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(204).json({ message: 'Like removido com sucesso.' });
        } else {
            await Like.create({
                user_id: userId,
                recurso_id: req.params.recursoId
            });
            return res.status(201).json({ message: 'Like adicionado com sucesso.' });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
            console.log('Usuario Não Logado');
            return res.status(401).json({ error: 'Usuário não autenticado. Por favor, faça login novamente.' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro ao processar a solicitação de Like.' });
    }
});

// Contar os likes para um recurso específico
recursoRouter.get('/:recursoId/likes/count', async (req, res) => {
    try {
        const likeCount = await Like.count({
            where: {
                recurso_id: req.params.recursoId
            }
        });

        return res.status(200).json({ likeCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocorreu um erro ao obter a contagem de likes.' });
    }
});

module.exports = recursoRouter